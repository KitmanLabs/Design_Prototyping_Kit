import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer/mixins';


const AthleteSelectorDrawer = ({
  title,
  open,
  onClose,
  children,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      id="athlete-drawer"
      anchor="right"
      open={open}
      onClose={onClose}
      sx={drawerMixin({ theme, isOpen: open })}
    >
      <Box display="flex" flexDirection="column" height="100%" gap="0.5rem">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          pt={2}
        >
          <Typography variant="h6">
            {title ?? i18n.t('Select Athletes')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Drawer>
  );
};

export default AthleteSelectorDrawer;
