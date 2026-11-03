import { Stack, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import i18n from '@kitman/common/src/utils/i18n';
import IconButton from '@mui/material/IconButton';
import CategoryIcon from '@mui/icons-material/Category';
import GroupMenu from './GroupMenu';


const SearchBar = ({ onSearchChange, isLoading, grouping, Search, hideGroupBy = false }) => {
  const [groupMenuEl, setGroupMenuEl] = useState(null);
  const debounceHandleSearch = debounce(onSearchChange, 600);

  const renderSearch = () => {
    if (!Search) {
      return (
        <TextField
          size="small"
          placeholder="Search"
          onChange={(e) => debounceHandleSearch(e.target.value)}
          fullWidth
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      );
    }

    return (
      <Search
        onChange={(value) => debounceHandleSearch(value)}
        isLoading={isLoading}
      />
    );
  };

  return (
    <>
      <Stack flex={1}>{renderSearch()}</Stack>
      {!hideGroupBy && (
        <Stack direction="row" spacing={1}>
          <Tooltip title={i18n.t('Group by')}>
            <IconButton onClick={(e) => setGroupMenuEl(e.currentTarget)}>
              <CategoryIcon />
            </IconButton>
          </Tooltip>
          <GroupMenu
            isDisabled={isLoading}
            groupMenuEl={groupMenuEl}
            grouping={grouping}
            handleClose={() => setGroupMenuEl(null)}
          />
        </Stack>
      )}
    </>
  );
};

export default SearchBar;
