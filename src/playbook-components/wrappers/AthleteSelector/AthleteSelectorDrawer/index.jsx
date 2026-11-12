import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';


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
      // As in kitman-playbook: 500px, not the mixin's 460px default, with no sideways scroll.
      sx={{
        ...drawerMixin({ theme, isOpen: open, drawerWidth: 500 }),
        overflowX: 'hidden',
      }}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-label': title ?? i18n.t('Select athletes'),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "0.5rem"
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pt: 2
          }}>
          <Typography variant="h6">
            {title ?? i18n.t('Select athletes')}
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
