import { Box } from '@kitman/playbook/components';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';


const ConfigurableGridToolbar = ({
  showColumnSelectorButton,
  showFilterButton,
  showDensitySelectorButton,
  showExportButton,
  showQuickFilter,
  excelExportOptions,
  quickFilterProps,
  ...other
}) => {
  return (
    <GridToolbarContainer {...other}>
      <>
        {showColumnSelectorButton && <GridToolbarColumnsButton />}
        {showFilterButton && <GridToolbarFilterButton />}
        {showDensitySelectorButton && <GridToolbarDensitySelector />}
        {showExportButton && (
          <GridToolbarExport excelExportOptions={excelExportOptions} />
        )}
      </>
      <Box sx={{ flexGrow: 1 }} />
      {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
    </GridToolbarContainer>
  );
};

export default ConfigurableGridToolbar;
