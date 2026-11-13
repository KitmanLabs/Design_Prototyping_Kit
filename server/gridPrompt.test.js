// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import Anthropic from '@anthropic-ai/sdk'
import {
  GRID_PROMPT_MODEL,
  GRID_PROMPT_SCHEMA,
  GridPromptError,
  describeError,
  gridPromptPlugin,
  readOnePasswordSecret,
  resolveGridPrompt,
  toPromptResponse,
} from './gridPrompt.js'

const context = JSON.stringify([
  { field: 'availability_status', type: 'string', examples: ['Available', 'Injured'], allowedOperators: ['equals'] },
])

// A stand-in for the Anthropic client that returns one canned message.
const mockClient = (message) => {
  const create = vi.fn().mockResolvedValue(message)
  return { client: { beta: { messages: { create } } }, create }
}

const answer = (output) => ({
  stop_reason: 'end_turn',
  content: [{ type: 'text', text: JSON.stringify(output) }],
})

const emptyOutput = { select: -1, filters: [], filterOperator: 'and', sorting: [], grouping: [], aggregation: [] }

describe('resolveGridPrompt', () => {
  it('asks Claude Sonnet 5.5 for structured grid settings and returns them in the grid’s shape', async () => {
    const { client, create } = mockClient(answer({
      ...emptyOutput,
      filters: [{ column: 'availability_status', operator: 'equals', value: 'Injured' }],
      aggregation: [{ column: 'training_load', function: 'avg' }],
    }))

    const result = await resolveGridPrompt(client, { query: 'injured athletes', context, conversationId: 'c-1' })

    const request = create.mock.calls[0][0]
    expect(request.model).toBe(GRID_PROMPT_MODEL)
    expect(request.fallbacks).toBe('default')
    expect(request.betas).toEqual(['server-side-fallback-2026-07-01'])
    expect(request.output_config.format).toEqual({ type: 'json_schema', schema: GRID_PROMPT_SCHEMA })
    expect(request.messages[0].content).toContain(context)
    expect(request.messages[0].content).toContain('injured athletes')

    expect(result).toEqual({
      conversationId: 'c-1',
      select: -1,
      filters: [{ column: 'availability_status', operator: 'equals', value: 'Injured' }],
      filterOperator: 'and',
      sorting: [],
      grouping: [],
      aggregation: { training_load: 'avg' },
      pivoting: {},
      chart: null,
    })
  })

  it('starts a conversation when the grid sends none', async () => {
    const { client } = mockClient(answer(emptyOutput))
    const result = await resolveGridPrompt(client, { query: 'sort by name', context })
    expect(result.conversationId).toEqual(expect.any(String))
  })

  it('turns a refusal into a message for the person', async () => {
    const { client } = mockClient({ stop_reason: 'refusal', content: [] })
    await expect(resolveGridPrompt(client, { query: 'x', context })).rejects.toBeInstanceOf(GridPromptError)
  })
})

describe('describeError', () => {
  it('asks for an API key when authentication fails', () => {
    const error = new Anthropic.AuthenticationError(401, undefined, 'invalid key', new Headers())
    expect(describeError(error)).toMatchObject({ status: 401, message: expect.stringContaining('ANTHROPIC_API_KEY') })
  })

  it('passes person-facing messages through', () => {
    expect(describeError(new GridPromptError('Try again.'))).toEqual({ status: 422, message: 'Try again.' })
  })
})

// Drives the plugin's middleware with a fake request and response.
const post = (middleware, body) =>
  new Promise((resolve) => {
    const handlers = {}
    const req = {
      method: 'POST',
      on: (event, handler) => {
        handlers[event] = handler
        if (event === 'end') {
          handlers.data?.(JSON.stringify(body))
          handler()
        }
      },
    }
    const res = {
      statusCode: 200,
      setHeader: () => {},
      end: (text) => resolve({ status: res.statusCode, body: JSON.parse(text) }),
    }
    middleware(req, res)
  })

describe('gridPromptPlugin with a 1Password reference', () => {
  const reference = 'op://Engineering/gtgcgtpr65g6qszn62b3z4eo3q/credential'

  it('reads the key once, on the first prompt, and keeps it in memory', async () => {
    const readSecret = vi.fn().mockResolvedValue('sk-test')
    const { client } = mockClient(answer(emptyOutput))
    const createClient = vi.fn().mockReturnValue(client)
    const { middleware } = gridPromptPlugin({ apiKeyRef: reference, readSecret, createClient })

    expect(readSecret).not.toHaveBeenCalled()
    const first = await post(middleware, { query: 'sort by name', context })
    await post(middleware, { query: 'group by squad', context })

    expect(first).toMatchObject({ status: 200, body: { ok: true } })
    expect(readSecret).toHaveBeenCalledTimes(1)
    expect(readSecret).toHaveBeenCalledWith(reference)
    expect(createClient).toHaveBeenCalledWith({ apiKey: 'sk-test' })
  })

  it('reports a failed 1Password read and tries again on the next prompt', async () => {
    const readSecret = vi.fn()
      .mockRejectedValueOnce(new GridPromptError('Unlock 1Password.'))
      .mockResolvedValueOnce('sk-test')
    const { client } = mockClient(answer(emptyOutput))
    const { middleware } = gridPromptPlugin({ apiKeyRef: reference, readSecret, createClient: () => client })

    expect(await post(middleware, { query: 'sort by name', context })).toEqual({
      status: 422,
      body: { ok: false, message: 'Unlock 1Password.' },
    })
    expect(await post(middleware, { query: 'sort by name', context })).toMatchObject({ status: 200 })
    expect(readSecret).toHaveBeenCalledTimes(2)
  })

  it('rejects references that are not 1Password secret references', async () => {
    await expect(readOnePasswordSecret('not-a-reference')).rejects.toBeInstanceOf(GridPromptError)
  })

  it('rejects an account setting that could be read as a command-line option', async () => {
    await expect(readOnePasswordSecret(reference, { account: '--session=x' })).rejects.toBeInstanceOf(GridPromptError)
  })
})

describe('toPromptResponse with pivoting and charts', () => {
  it('converts a pivot and a chart into the grid’s shape', () => {
    const result = toPromptResponse({
      ...emptyOutput,
      pivoting: {
        columns: [{ column: 'position_group', direction: 'asc' }],
        rows: ['squad_name'],
        values: [{ column: 'wellbeing_score', function: 'avg' }],
      },
      chart: { dimensions: ['squad_name'], values: ['wellbeing_score'] },
    }, 'c-3')
    expect(result.pivoting).toEqual({
      columns: [{ column: 'position_group', direction: 'asc' }],
      rows: ['squad_name'],
      values: [{ wellbeing_score: 'avg' }],
    })
    expect(result.chart).toEqual({ dimensions: ['squad_name'], values: ['wellbeing_score'] })
  })

  it('sends no pivot and no chart when Claude leaves them empty', () => {
    const result = toPromptResponse({
      ...emptyOutput,
      pivoting: { columns: [], rows: [], values: [] },
      chart: { dimensions: [], values: [] },
    }, 'c-4')
    expect(result.pivoting).toEqual({})
    expect(result.chart).toBeNull()
  })
})

describe('toPromptResponse', () => {
  it('defaults missing settings to empty', () => {
    expect(toPromptResponse({}, 'c-2')).toMatchObject({ select: -1, filters: [], aggregation: {}, pivoting: {}, chart: null })
  })
})
