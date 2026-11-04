// Offline stand-in for a Data Grid AI Assistant prompt service, for Storybook only.
//
// In iP the grid's `onPrompt` would call a server route that asks a language model to turn
// the prompt into a PromptResponse (MUI's `unstable_gridDefaultPromptResolver` posts to such
// a route). This prototype has no backend, so this stub recognises a few phrasings about the
// sample rows (category, status, quantity) and answers in the same PromptResponse shape.

const CATEGORIES = ['gadgets', 'parts', 'tools', 'systems'];
const STATUSES = ['active', 'inactive', 'archived'];
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export const AI_PROMPT_SUGGESTIONS = [
  { value: 'Show active gadgets' },
  { value: 'Sort by quantity, highest first' },
  { value: 'Group by category with total quantity' },
  { value: 'Quantity over 20' },
];

export function resolvePromptLocally(prompt, _context, conversationId) {
  const text = prompt.toLowerCase();
  const filters = [];
  const sorting = [];
  const grouping = [];
  const aggregation = {};

  const category = CATEGORIES.find((c) => text.includes(c) || text.includes(c.replace(/s$/, '')));
  if (category) filters.push({ column: 'category', operator: 'equals', value: capitalise(category) });

  const status = STATUSES.find((s) => new RegExp(`\\b${s}\\b`).test(text));
  if (status) filters.push({ column: 'status', operator: 'equals', value: capitalise(status) });

  const over = text.match(/(?:over|more than|above|greater than)\s+(\d+)/);
  if (over) filters.push({ column: 'quantity', operator: '>', value: Number(over[1]) });
  const under = text.match(/(?:under|less than|below|fewer than)\s+(\d+)/);
  if (under) filters.push({ column: 'quantity', operator: '<', value: Number(under[1]) });

  if (/sort|order|highest|lowest|most|least/.test(text)) {
    const column = /name|alphabet/.test(text) ? 'name' : 'quantity';
    const direction = /lowest|least|ascending|a to z|a-z/.test(text) ? 'asc' : 'desc';
    sorting.push({ column, direction });
  }

  if (/group/.test(text)) {
    grouping.push({ column: /status/.test(text) && !/category/.test(text) ? 'status' : 'category' });
  }
  if (/total|sum/.test(text)) aggregation.quantity = 'sum';
  if (/average|avg|mean/.test(text)) aggregation.quantity = 'avg';

  if (!filters.length && !sorting.length && !grouping.length && !Object.keys(aggregation).length) {
    return Promise.reject(new Error(
      'This offline demo understands filters by category, status or quantity ("quantity over 20"), sorting ("highest first"), grouping ("group by category") and totals.',
    ));
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve({
      conversationId: conversationId || `demo-${Date.now()}`,
      select: -1,
      filters,
      filterOperator: 'and',
      aggregation,
      sorting,
      grouping,
      pivoting: {},
      chart: null,
    }), 400);
  });
}
