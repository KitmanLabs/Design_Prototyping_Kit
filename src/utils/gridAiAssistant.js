import { unstable_gridDefaultPromptResolver } from '@mui/x-data-grid-premium'

// The dev-server route in server/gridPrompt.js. It asks Claude to turn the request into
// filters, sorting, grouping and aggregation, and the grid applies them.
export const GRID_PROMPT_URL = '/api/grid-prompt'

// Pass as `onPrompt` on a DataGridPremium with `aiAssistant`.
export const resolveGridPrompt = (query, context, conversationId) =>
  unstable_gridDefaultPromptResolver(GRID_PROMPT_URL, query, context, conversationId)
