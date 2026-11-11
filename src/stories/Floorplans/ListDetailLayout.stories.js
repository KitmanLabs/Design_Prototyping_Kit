import { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '../../playbook-components';
import { ListDetailLayout } from '../../floorplans';
import athletes from '../../data/athletes';

const Demo = ({ startWithSelection }) => {
  const [selectedId, setSelectedId] = useState(startWithSelection ? athletes[0].id : null);
  const selected = athletes.find((a) => a.id === selectedId);

  return (
    <Box sx={{ height: 520, border: '1px dashed var(--color-border-primary)' }}>
      <ListDetailLayout
        hasSelection={Boolean(selected)}
        onBack={() => setSelectedId(null)}
        list={
          <List disablePadding>
            {athletes.map((a) => (
              <ListItemButton key={a.id} selected={a.id === selectedId} onClick={() => setSelectedId(a.id)}>
                <ListItemText primary={`${a.firstname} ${a.lastname}`} secondary={a.availability_status} />
              </ListItemButton>
            ))}
          </List>
        }
        detail={
          selected && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">{`${selected.firstname} ${selected.lastname}`}</Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                {selected.position} · {selected.squad_name}
              </Typography>
            </Box>
          )
        }
      />
    </Box>
  );
};

export default {
  title: 'Floorplans/List-detail layout',
  component: ListDetailLayout,
  render: (args) => <Demo {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A list pane (one third) and a detail pane (two thirds). The detail shows an empty state until something is selected. Below the md breakpoint only one pane shows, with Back to return to the list.',
      },
    },
  },
  tags: ['autodocs'],
  args: { startWithSelection: false },
};

export const NothingSelected = {};

export const WithSelection = { args: { startWithSelection: true } };
