// MUI's DataGridPremium is used directly here: the Playbook DataGridPremium wrapper swaps in
// its own ConfigurableGridToolbar, which has no AI Assistant trigger.
import {
  DataGridPremium,
  GridAiAssistantPanel,
} from '@mui/x-data-grid-premium';
import { Box } from '../../playbook-components';
import { baseColumns, sampleRows } from './utils';
import { AI_PROMPT_SUGGESTIONS, resolvePromptLocally } from './utils/aiPromptStub';

const columns = baseColumns.map((column) => {
  // Example values help the assistant (and a real model) map words to columns.
  if (column.field === 'category') return { ...column, examples: ['Gadgets', 'Parts', 'Tools'] };
  if (column.field === 'status') return { ...column, examples: ['Active', 'Inactive', 'Archived'] };
  return column;
});

export default {
  title: 'Table/DataGridAiAssistant',
  component: DataGridPremium,
  render: (args) => (
    <Box sx={{ height: 520, width: 950, p: 2, boxSizing: 'border-box' }}>
      <DataGridPremium
        rows={sampleRows}
        columns={columns}
        showToolbar
        aiAssistant
        onPrompt={resolvePromptLocally}
        aiAssistantSuggestions={AI_PROMPT_SUGGESTIONS}
        slots={{ aiAssistantPanel: GridAiAssistantPanel }}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pagination
        {...args}
      />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Data Grid AI Assistant (MUI X Premium). Open the assistant from the toolbar and describe the view you want; the grid applies the filters, sorting, grouping and aggregation it gets back. In this prototype, prompts are answered by an offline stub (src/stories/Table/utils/aiPromptStub.js) that understands a few phrasings. In iP, `onPrompt` would call a server route that asks a language model, so provider keys stay on the server.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {};
