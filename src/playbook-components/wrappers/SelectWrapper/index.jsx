import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

const defaultProps = {
  fullWidth: true,
  minWidth: 300,
  isMulti: false,
  invalid: false,
  isClearable: false,
  onClear: () => {},
};

const SelectWrapper = ({
  // required props
  label,
  value,
  options,
  onChange,

  // props with defaults
  fullWidth,
  minWidth,
  isMulti,
  invalid,
  isClearable,
  onClear,
}) => {
  const generateSelectLabelId = (labelId) => {
    const sanitizedLabel = labelId.replace(/\s/g, '');
    return `select-label-input-${sanitizedLabel}`;
  };

  const generateItemLabelId = (labelId) => {
    const sanitizedLabel = labelId.replace(/\s/g, '');
    return `item-label-input-${sanitizedLabel}`;
  };

  const hasValue = isMulti
    ? Array.isArray(value) && value.length > 0
    : value !== '' && value !== null && value !== undefined;

  return (
    <Box sx={{ minWidth }}>
      <FormControl fullWidth={fullWidth} error={invalid}>
        <InputLabel id={generateSelectLabelId(label)}>{label}</InputLabel>
        <Select
          labelId={generateSelectLabelId(label)}
          label={label}
          value={value}
          onChange={onChange}
          multiple={isMulti}
          endAdornment={
            isClearable && hasValue ? (
              <Box sx={{ mr: 3 }}>
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear selection"
                    onClick={onClear}
                    onMouseDown={(e) => e.stopPropagation()} // prevent menu from opening
                    edge="end"
                    size="small"
                    sx={{ p: 0.25 }}
                  >
                    <KitmanIcon
                      name={KITMAN_ICON_NAMES.Close}
                      fontSize="small"
                    />
                  </IconButton>
                </InputAdornment>
              </Box>
            ) : null
          }
        >
          {options.map((option) => {
            return (
              <MenuItem
                id={generateItemLabelId(option.label)}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

SelectWrapper.defaultProps = defaultProps;
export default SelectWrapper;
