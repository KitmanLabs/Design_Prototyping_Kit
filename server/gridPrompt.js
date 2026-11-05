// Answers the data grid AI Assistant during `npm run dev`.
//
// MUI's DataGridPremium does not call a model itself: when someone types a request, the grid
// posts it (with a JSON description of its columns) to a prompt service and applies the
// filters, sorting, grouping and aggregation it gets back. This is that service for the kit:
// a Vite dev-server route that asks Claude. The API key stays on the server (read from the
// environment or `.env`); it never reaches the browser. In iP this would be a server route.
import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'

export const GRID_PROMPT_PATH = '/api/grid-prompt'
export const GRID_PROMPT_MODEL = 'claude-sonnet-5-5'

const SYSTEM_PROMPT = `You configure a data grid from a person's request.

You receive the grid's columns as JSON: each has a field, a type, an optional description, example values, and the filter operators it allows. Turn the request into grid settings:
- filters: use only fields from the columns, only operators from that column's allowedOperators, and values in the same form as the examples (match case and spelling). For "isAnyOf", give an array of values.
- filterOperator: "and" unless the request clearly means either condition.
- sorting: fields with "asc" or "desc".
- grouping: fields to group rows by, in order.
- aggregation: a function (avg, sum, min, max or size) per numeric field, only when the request asks for totals, averages, counts or similar.
- select: how many of the top rows to select after the other settings apply, or -1 to select none. Use -1 unless the request asks to select rows.
- pivoting: only when the request asks to spread one field's values across columns, for example "wellbeing by squad per position group" or "pivot". columns: the field whose values become columns; rows: the fields that stay as rows; values: numeric fields with a function. Use grouping and aggregation instead when no field should become columns.
- chart: only when the request asks for a chart, graph or plot. dimensions: the category fields along the axis; values: numeric fields to plot. For a measure per category (for example "average training load by squad"), also group by the dimension and aggregate the value, so the chart shows one bar per category. With pivoting, list the pivoted value fields as the chart values.

Leave a setting empty when the request doesn't ask for it. If the request can't be expressed with these columns, return all settings empty.`

// The shape Claude returns. Aggregation comes back as a list and is converted to the
// { field: function } object the grid expects, because structured output needs fixed keys.
const FILTER_VALUE = {
  anyOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean' },
    { type: 'array', items: { type: 'string' } },
    { type: 'array', items: { type: 'number' } },
  ],
}

const SORT_LIST = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      column: { type: 'string' },
      direction: { type: 'string', enum: ['asc', 'desc'] },
    },
    required: ['column', 'direction'],
    additionalProperties: false,
  },
}

const AGGREGATION_LIST = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      column: { type: 'string' },
      function: { type: 'string', enum: ['avg', 'sum', 'min', 'max', 'size'] },
    },
    required: ['column', 'function'],
    additionalProperties: false,
  },
}

export const GRID_PROMPT_SCHEMA = {
  type: 'object',
  properties: {
    select: { type: 'integer' },
    filters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          operator: { type: 'string' },
          value: FILTER_VALUE,
        },
        required: ['column', 'operator', 'value'],
        additionalProperties: false,
      },
    },
    filterOperator: { type: 'string', enum: ['and', 'or'] },
    sorting: SORT_LIST,
    grouping: {
      type: 'array',
      items: {
        type: 'object',
        properties: { column: { type: 'string' } },
        required: ['column'],
        additionalProperties: false,
      },
    },
    aggregation: AGGREGATION_LIST,
    pivoting: {
      type: 'object',
      properties: {
        columns: SORT_LIST,
        rows: { type: 'array', items: { type: 'string' } },
        values: AGGREGATION_LIST,
      },
      required: ['columns', 'rows', 'values'],
      additionalProperties: false,
    },
    chart: {
      type: 'object',
      properties: {
        dimensions: { type: 'array', items: { type: 'string' } },
        values: { type: 'array', items: { type: 'string' } },
      },
      required: ['dimensions', 'values'],
      additionalProperties: false,
    },
  },
  required: ['select', 'filters', 'filterOperator', 'sorting', 'grouping', 'aggregation', 'pivoting', 'chart'],
  additionalProperties: false,
}

// A message the grid shows to the person, for problems they can act on.
export class GridPromptError extends Error {}

const SETUP_MESSAGE =
  'The AI Assistant needs a Claude API key. Set ANTHROPIC_API_KEY_REF (a 1Password secret reference) or ANTHROPIC_API_KEY in .env and restart npm run dev.'

// Reads a secret from 1Password with the `op` CLI, so the key never sits in a file.
// 1Password may ask to approve the read (Touch ID or the app) the first time.
// `account` picks a 1Password account when more than one is signed in (its shorthand,
// sign-in address, email or ID, as `op account list` shows them); otherwise op uses the default.
export function readOnePasswordSecret(reference, { account } = {}) {
  return new Promise((resolve, reject) => {
    if (!reference.startsWith('op://')) {
      reject(new GridPromptError('ANTHROPIC_API_KEY_REF must be a 1Password secret reference starting op://.'))
      return
    }
    if (account && !/^[A-Za-z0-9][\w.@-]*$/.test(account)) {
      reject(new GridPromptError('ANTHROPIC_API_KEY_OP_ACCOUNT should be an account shorthand, sign-in address, email or ID.'))
      return
    }
    const args = ['read', '--no-newline', ...(account ? ['--account', account] : []), reference]
    // execFile runs op directly (no shell), so the reference can't inject commands.
    execFile('op', args, { timeout: 60000 }, (error, stdout) => {
      if (error?.code === 'ENOENT') {
        reject(new GridPromptError('The 1Password CLI (op) isn’t installed. Install it, or set ANTHROPIC_API_KEY instead.'))
      } else if (error) {
        reject(new GridPromptError('Couldn’t read the Claude API key from 1Password. Unlock 1Password, approve the request, and try again.'))
      } else if (!stdout) {
        reject(new GridPromptError('The 1Password item has no value at that reference. Check ANTHROPIC_API_KEY_REF.'))
      } else {
        resolve(stdout)
      }
    })
  })
}

const toAggregation = (list = []) => Object.fromEntries(list.map((item) => [item.column, item.function]))

export function toPromptResponse(output, conversationId) {
  const pivot = output.pivoting
  const chart = output.chart
  return {
    conversationId: conversationId || randomUUID(),
    select: Number.isInteger(output.select) ? output.select : -1,
    filters: output.filters ?? [],
    filterOperator: output.filterOperator ?? 'and',
    sorting: output.sorting ?? [],
    grouping: output.grouping ?? [],
    aggregation: toAggregation(output.aggregation),
    // The grid treats any object with `columns` as a pivot, so an unused pivot is sent as {}.
    pivoting: pivot?.columns?.length && pivot?.values?.length
      ? {
          columns: pivot.columns,
          rows: pivot.rows ?? [],
          values: pivot.values.map((item) => ({ [item.column]: item.function })),
        }
      : {},
    chart: chart?.dimensions?.length && chart?.values?.length
      ? { dimensions: chart.dimensions, values: chart.values }
      : null,
  }
}

export async function resolveGridPrompt(client, { query, context, conversationId }) {
  const response = await client.beta.messages.create({
    model: GRID_PROMPT_MODEL,
    max_tokens: 16000,
    // If Claude Sonnet 5.5 declines, Anthropic retries on its recommended fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM_PROMPT,
    // A short, well-defined task with someone waiting on it: low effort keeps it quick.
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: GRID_PROMPT_SCHEMA },
    },
    messages: [{ role: 'user', content: `Columns:\n${context}\n\nRequest: ${query}` }],
  })

  if (response.stop_reason === 'refusal') {
    throw new GridPromptError('The AI Assistant can’t help with that request. Try describing the view you want.')
  }
  if (response.stop_reason === 'max_tokens') {
    throw new GridPromptError('That request produced too long an answer. Try a simpler request.')
  }
  const text = response.content.find((block) => block.type === 'text')?.text
  if (!text) throw new GridPromptError('The AI Assistant returned no answer. Try again.')
  return toPromptResponse(JSON.parse(text), conversationId)
}

// The message the grid shows for each kind of failure.
export function describeError(error) {
  if (error instanceof GridPromptError) return { status: 422, message: error.message }
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return { status: 401, message: SETUP_MESSAGE }
  }
  if (error instanceof Anthropic.RateLimitError) {
    return { status: 429, message: 'The AI Assistant is busy. Wait a moment and try again.' }
  }
  if (error instanceof Anthropic.APIError) {
    return { status: 502, message: `Claude returned an error (${error.status ?? 'no status'}). Try again.` }
  }
  // Raised by the SDK before any request when no credentials can be found.
  if (error instanceof Anthropic.AnthropicError) return { status: 401, message: SETUP_MESSAGE }
  return { status: 500, message: 'The AI Assistant hit an unexpected error. Check the dev server log.' }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        reject(new GridPromptError('The request to the AI Assistant was malformed.'))
      }
    })
    req.on('error', reject)
  })
}

// Vite plugin: serves GRID_PROMPT_PATH during `npm run dev` (and `vite preview`).
// The response follows the shape MUI's unstable_gridDefaultPromptResolver reads:
// { ok: true, data: PromptResponse } or { ok: false, message }.
//
// Credentials, in order: `apiKey`; then `apiKeyRef`, a 1Password secret reference read just in
// time on the first prompt and kept only in memory; then whatever the SDK finds itself
// (ANTHROPIC_API_KEY in the environment or an `ant auth login` profile).
export function gridPromptPlugin({
  apiKey,
  apiKeyRef,
  opAccount,
  readSecret = (reference) => readOnePasswordSecret(reference, { account: opAccount }),
  createClient = (options) => new Anthropic(options),
} = {}) {
  let clientPromise
  const getClient = () => {
    clientPromise ??= (async () => {
      const key = apiKey || (apiKeyRef ? await readSecret(apiKeyRef) : undefined)
      return createClient(key ? { apiKey: key } : {})
    })()
    // A failed read (1Password locked, request declined) is retried on the next prompt.
    clientPromise.catch(() => { clientPromise = undefined })
    return clientPromise
  }

  const middleware = async (req, res) => {
    const send = (status, body) => {
      res.statusCode = status
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(body))
    }
    if (req.method !== 'POST') {
      send(405, { ok: false, message: 'Use POST.' })
      return
    }
    try {
      const body = await readJsonBody(req)
      if (typeof body.query !== 'string' || !body.query.trim()) {
        send(400, { ok: false, message: 'Type a request for the grid.' })
        return
      }
      const data = await resolveGridPrompt(await getClient(), body)
      send(200, { ok: true, data })
    } catch (error) {
      const { status, message } = describeError(error)
      if (status >= 500) console.error('[grid-prompt]', error)
      send(status, { ok: false, message })
    }
  }

  return {
    name: 'kit-grid-prompt',
    // Exposed for tests.
    middleware,
    configureServer(server) {
      server.middlewares.use(GRID_PROMPT_PATH, middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(GRID_PROMPT_PATH, middleware)
    },
  }
}
