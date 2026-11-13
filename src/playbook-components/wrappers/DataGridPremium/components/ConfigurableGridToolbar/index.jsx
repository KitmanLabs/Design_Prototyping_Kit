import { Box } from '@kitman/playbook/components';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
  AiAssistantPanelTrigger,
  ChartsPanelTrigger,
  PivotPanelTrigger,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid-premium';

// Kit: a toolbar button that opens one of the grid's side panels (AI Assistant, Charts, Pivot),
// styled like the other toolbar buttons.
const PanelButton = ({ Trigger, iconSlot, labelKey }) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const BaseButton = rootProps.slots.baseButton;
  const Icon = rootProps.slots[iconSlot];
  return (
    <Trigger
      render={(triggerProps) => (
        <BaseButton {...triggerProps} size="small" startIcon={<Icon fontSize="small" />}>
          {apiRef.current.getLocaleText(labelKey)}
        </BaseButton>
      )}
    />
  );
};

const ConfigurableGridToolbar = ({
  showColumnSelectorButton,
  showFilterButton,
  showDensitySelectorButton,
  showExportButton,
  showQuickFilter,
  showAiAssistantButton,
  showChartsButton,
  showPivotButton,
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
        {showPivotButton && (
          <PanelButton Trigger={PivotPanelTrigger} iconSlot="pivotIcon" labelKey="toolbarPivot" />
        )}
        {showChartsButton && (
          <PanelButton Trigger={ChartsPanelTrigger} iconSlot="chartsIcon" labelKey="toolbarCharts" />
        )}
        {showAiAssistantButton && (
          <PanelButton Trigger={AiAssistantPanelTrigger} iconSlot="aiAssistantIcon" labelKey="toolbarAssistant" />
        )}
      </>
      <Box sx={{ flexGrow: 1 }} />
      {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
    </GridToolbarContainer>
  );
};

export default ConfigurableGridToolbar;
