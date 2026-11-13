import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@kitman/playbook/components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MENU_ANCHOR_ORIGIN, MENU_TRANSFORM_ORIGIN } from '../constants';


export function ActionsMenu(props) {
  const {
    generalActions,
    exportActions,
    anchorEl,
    isOpen,
    onOpen,
    onClose,
    onItemClick,
  } = props;

  return (
    <>
      <IconButton size="small" onClick={onOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={MENU_ANCHOR_ORIGIN}
        transformOrigin={MENU_TRANSFORM_ORIGIN}
      >
        {generalActions.map((action) => (
          <MenuItem
            key={action.id}
            disabled={action.disabled}
            onClick={() => onItemClick(action)}
          >
            {action.label}
          </MenuItem>
        ))}

        {generalActions.length > 0 && exportActions.length > 0 && <Divider />}

        {exportActions.map((action) => (
          <MenuItem
            key={action.id}
            disabled={action.disabled}
            onClick={() => onItemClick(action)}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
