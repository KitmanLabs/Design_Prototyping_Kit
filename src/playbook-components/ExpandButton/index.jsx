import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { IconButton } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';

const style = {
  padding: 0,
  '&:hover': {
    backgroundColor: colors.transparent_background,
  },
};


const ExpandButton = ({
  handleClick,
  isCollapsed,
  ariaLabel = 'Expand list',
  isDisabled,
}) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      disabled={isDisabled}
      size="small"
      sx={style}
    >
      {isCollapsed ? (
        <ExpandMore fontSize="small" />
      ) : (
        <ExpandLess fontSize="small" />
      )}
    </IconButton>
  );
};

export default ExpandButton;
