import {
  ListItem,
  Checkbox,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import { chipColorFor, getInitial } from '../utils';



const styles = {
  sm: {
    minHeight: 36,
    primaryFont: '0.925rem',
    secondaryFont: '0.7rem',
    checkboxSize: 'small',
    checkboxMr: 0,
    avatarMinWidth: 32,
    avatarSize: 26,
    avatarFont: '0.7rem',
    chipFont: '0.65rem',
    chipHeight: 20,
    chipSize: 'small',
    rootPaddingY: 1,
  },
  md: {
    minHeight: 53,
    primaryFont: '1rem',
    secondaryFont: '0.875rem',
    checkboxSize: 'medium',
    checkboxMr: '8px',
    avatarMinWidth: 56,
    avatarSize: 40,
    avatarFont: '1rem',
    chipFont: '0.875rem',
    chipHeight: 32,
    chipSize: 'medium',
    rootPaddingY: '4px',
  },
};

const AthleteListItem = ({
  athlete,
  selectedIds,
  handleToggleAthlete,
  size = 'md',
  disabled = false,
  onDisabledClick,
}) => {
  const style = styles[size];

  const checked = selectedIds.has(athlete.id);

  const handleClick = () => {
    if (disabled) {
      if (onDisabledClick) {
        onDisabledClick();
      }
      return;
    }
    handleToggleAthlete(athlete.id);
  };

  return (
    <ListItem
      key={athlete.key}
      onClick={handleClick}
      sx={{
        py: style.rootPaddingY,
        px: 2,
        cursor: 'pointer',
        minHeight: style.minHeight,
        opacity: disabled ? 0.5 : 1,
        '& .MuiListItemText-primary': {
          fontSize: style.primaryFont,
        },
        '& .MuiListItemText-secondary': {
          fontSize: style.secondaryFont,
        },
      }}
    >
      <Checkbox
        sx={{
          mr: style.checkboxMr,
          cursor: 'pointer',
          ...(!checked && {
            '&.MuiButtonBase-root .MuiSvgIcon-root': {
              color: 'text.secondary',
              opacity: 0.6,
            },
          }),
          '&.Mui-disabled': disabled
            ? {
                cursor: 'pointer',
                pointerEvents: 'none',
              }
            : {},
        }}
        edge="start"
        checked={checked}
        size={style.checkboxSize}
        disabled={disabled}
      />

      <ListItemAvatar sx={{ minWidth: style.avatarMinWidth }}>
        <Avatar
          src={athlete.avatarUrl}
          sx={{
            width: style.avatarSize,
            height: style.avatarSize,
            fontSize: style.avatarFont,
          }}
        >
          {!athlete.avatarUrl && getInitial(athlete.name)}
        </Avatar>
      </ListItemAvatar>

      <ListItemText primary={athlete.name} secondary={athlete.position || ''} />

      {athlete.status && (
        <Chip
          label={i18n.t(athlete.status || 'Unknown')}
          color={chipColorFor(athlete.status)}
          size={style.chipSize}
          sx={{
            fontSize: style.chipFont,
            height: style.chipHeight,
          }}
        />
      )}
    </ListItem>
  );
};

export default AthleteListItem;