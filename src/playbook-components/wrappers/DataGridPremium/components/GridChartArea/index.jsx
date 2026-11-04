// Kit: draws the grid's chart below it (DataGridPremium `chartsIntegration`).
// The chart is set up from the toolbar's Charts panel or by the AI Assistant. Nothing is drawn
// until it has both dimensions and values, so grids without a chart keep their full height.
import { Box } from '@kitman/playbook/components';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';

export const GRID_CHART_ID = 'main';
const CHART_HEIGHT = 320;

const GridChartArea = (props) => {
  if (!props.dimensions?.length || !props.values?.length) return null;
  return (
    <Box
      data-testid="GridChartArea"
      sx={{
        height: CHART_HEIGHT,
        flexShrink: 0,
        borderTop: '1px solid var(--color-border-primary)',
        p: 2,
      }}
    >
      <ChartsRenderer {...props} />
    </Box>
  );
};

export default GridChartArea;
