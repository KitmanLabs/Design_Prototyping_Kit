import i18n from '@kitman/common/src/utils/i18n';
import { STANDARD_TOOLBAR_HEIGHT } from '@kitman/playbook/components/wrappers/DataGridPremium/constants';
import { Box, Typography, Button, alpha } from '@mui/material';



const BulkActionsToolbar = ({
  selectedRowIds,
  bulkActions,
}) => {
  const selectionCount = selectedRowIds.length;

  const defaultBulkActionButtonProps = {
    variant: 'contained',
    color: 'secondary',
    size: 'medium',
    sx: { textTransform: 'none', minWidth: 'auto' },
  };

  const deleteBulkActionButtonProps = {
    ...defaultBulkActionButtonProps,
    color: 'error',
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: STANDARD_TOOLBAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pl: 2,
        pr: 2,
        overflowX: 'auto',
        backgroundColor: alpha(theme.palette.primary.light, 0.12),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(
          ['background-color', 'border-color'],
          {
            duration: theme.transitions.duration.shortest,
          }
        ),
      })}
    >
      <Typography variant="subtitle1" sx={{ mr: 2, whiteSpace: 'nowrap' }}>
        {selectionCount}{' '}
        {selectionCount === 1 ? i18n.t('item') : i18n.t('items')}{' '}
        {i18n.t('selected')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {bulkActions.map(
          ({ key, disabled, visible = true, icon, onAction, label }) => {
            const bulkActionButtonProps =
              key === 'delete'
                ? deleteBulkActionButtonProps
                : defaultBulkActionButtonProps;
            if (visible) {
              return (
                <Button
                  key={key}
                  variant={bulkActionButtonProps.variant || 'contained'}
                  color={bulkActionButtonProps.color || 'secondary'}
                  size={bulkActionButtonProps.size || 'medium'}
                  sx={bulkActionButtonProps.sx}
                  startIcon={icon}
                  disabled={disabled}
                  onClick={() => onAction(selectedRowIds)}
                >
                  {label}
                </Button>
              );
            }
            return null;
          }
        )}
      </Box>
    </Box>
  );
};

export default BulkActionsToolbar;
