import { withTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  Typography,
  Button,
  Toolbar,
} from '@kitman/playbook/components';
import rootTheme from '@kitman/playbook/themes';



const GenericActionBar = ({
  selectedCount,
  actions,
  customContent,
  t,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Toolbar
      data-testid="GenericActionBar"
      sx={{
        backgroundColor: rootTheme.palette.primary.focus,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {selectedCount > 0 && (
          <Typography variant="subtitle1">
            {selectedCount} {t('selected')}
          </Typography>
        )}
        {customContent}
      </Box>

      <Stack direction="row" spacing={2}>
        {actions.map((action) => (
          <Button
            key={action.id}
            color={action.color || 'secondary'}
            variant={action.variant || 'contained'}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Toolbar>
  );
};

export const GenericActionBarTranslated = withTranslation()(GenericActionBar);
export default GenericActionBar;
