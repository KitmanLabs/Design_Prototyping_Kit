import { useEffect, useRef, useState, useCallback } from 'react';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { VirtualizedListboxComponent } from '@kitman/playbook/utils/Autocomplete';
import { DEFAULT_PAGE_SIZE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import { Autocomplete, TextField } from '@kitman/playbook/components';




const INITIAL_PAGE = 1;

function LazyAutocomplete({
  load,
  data,
  isLoading,
  label,
  loadingText,
  totalPages,
  optionMapper,
  onChange,
  value,
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(INITIAL_PAGE);
  const [options, setOptions] = useState([]);

  const observerRef = useRef();

  useEffect(() => {
    setOptions((prev) => {
      const existingIds = new Set(prev.map(({ id }) => id));
      const newOptions = (data ?? [])
        .map(optionMapper)
        .filter((item) => !existingIds.has(item.id));

      return [...prev, ...newOptions];
    });
  }, [data, optionMapper]);

  useEffect(() => {
    load({ page, pageSize, searchText });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [load, page, pageSize, searchText]);

  const setIntersectionObserver = useCallback(
    (node, key) => {
      if (!(window.IntersectionObserver && node)) {
        return;
      }

      if (observerRef.current?.key === key) {
        return;
      }

      observerRef.current?.disconnect();

      observerRef.current = new window.IntersectionObserver((entries) => {
        const nextPage = page + 1;
        const hasMore = nextPage <= totalPages;
        const shouldLoadMore = hasMore && entries[0].isIntersecting;

        if (shouldLoadMore) {
          setPage(nextPage);
        }
      });
      observerRef.current.key = key;

      observerRef.current.observe(node);
    },
    [totalPages, page]
  );

  const debouncedSearchExpression = useDebouncedCallback((_, text) => {
    observerRef.current?.disconnect();
    setSearchText(text);
    setPage(INITIAL_PAGE);
  }, 400);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      loading={isLoading}
      loadingText={loadingText}
      onInputChange={debouncedSearchExpression}
      value={options.find((option) => option.id === value) ?? null}
      renderInput={(params) => <TextField {...params} label={label} />}
      ListboxComponent={VirtualizedListboxComponent}
      onChange={(_, option) => onChange(option)}
      renderOption={(listProps, option, { index }) => {
        const isLastElement = index === options.length - 1;

        return (
          <li
            {...listProps}
            key={option.id}
            ref={(node) =>
              isLastElement ? setIntersectionObserver(node, option.id) : null
            }
          >
            {option.label}
          </li>
        );
      }}
    />
  );
}

export { LazyAutocomplete };
