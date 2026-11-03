import { Menu, MenuItem } from '@mui/material';
import { Z_INDEX_ABOVE_DRAWER } from '../../utils';


const GroupMenu = ({
  groupMenuEl,
  handleClose,
  grouping,
  isDisabled,
}) => {
  if (!grouping) return null;

  return (
    <Menu
      anchorEl={groupMenuEl}
      open={Boolean(groupMenuEl)}
      onClose={handleClose}
      disabled={isDisabled}
      sx={{ zIndex: Z_INDEX_ABOVE_DRAWER }}
    >
      {grouping.options.map((option) => (
        <MenuItem
          key={option.value}
          selected={option.value === grouping.current}
          onClick={() => {
            grouping.setCurrent(option.value);
            handleClose();
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default GroupMenu;
