import { Box, Chip } from '@mui/material';
import { getChipStyles, getQuickFiltersBoxStyles } from './styles';

function QuickFilters({
  selectedFilter,
  onQuickSelect,
  filters,
}) {
  // Combine filters properly

  return (
    <Box
      sx={[{
        display: "flex",
        flexWrap: "wrap",
        gap: 1
      }, getQuickFiltersBoxStyles()]}>
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          onClick={() => onQuickSelect(filter.key)}
          variant="filled"
          clickable
          sx={getChipStyles(selectedFilter === filter.key)}
        />
      ))}
    </Box>
  );
}

export default QuickFilters;
