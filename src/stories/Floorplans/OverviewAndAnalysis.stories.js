import { useState } from 'react';
import { Box, Grid, Typography } from '../../playbook-components';
import { OverviewCard, KpiTile } from '../../floorplans';

export default {
  title: 'Floorplans/Overview and Analysis',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'OverviewCard: a card on an Overview, which summarizes and links out; the priority card is largest and first. KpiTile: a KPI on an Analysis page that also acts as a filter.',
      },
    },
  },
  tags: ['autodocs'],
};

export const OverviewCards = {
  render: () => (
    <Box sx={{ width: 960 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <OverviewCard priority title="Availability today" subtitle="7 of 8 athletes can train and play" action={{ label: 'View athletes', onClick: () => {} }}>
            <Typography variant="h4" component="p">7</Typography>
          </OverviewCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <OverviewCard title="Open injuries" action={{ label: 'View medical', onClick: () => {} }}>
            <Typography variant="h4" component="p">1</Typography>
          </OverviewCard>
        </Grid>
      </Grid>
    </Box>
  ),
};

const KpiDemo = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Box sx={{ width: 720, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <KpiTile label="Squad daily average" value="364 AU" hint="Last 28 days" />
      <KpiTile label="Sessions" value="160" hint="Across all athletes" />
      <KpiTile label="Load spikes" value="2" hint="ACWR above 1.3" tone="warning" selected={selected} onClick={() => setSelected(!selected)} />
    </Box>
  );
};

export const KpiTiles = { render: () => <KpiDemo /> };
