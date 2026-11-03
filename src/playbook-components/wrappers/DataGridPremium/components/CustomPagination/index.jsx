import { useGridRootProps, GridPagination } from '@mui/x-data-grid-premium';
import { Pagination } from '@kitman/playbook/components';

const MultiplePagesDisplayPagination = ({
  page,
  onPageChange,
  className,
}) => {
  const {
    rowCount = 0,
    paginationModel: { pageSize },
  } = useGridRootProps();

  const count = pageSize > 0 ? Math.ceil(rowCount / pageSize) : 1;

  return (
    <Pagination
      color="primary"
      className={className}
      // count - this is calculating the row count needed i.e (106 / 25) rounded up = 6 rows
      count={count || 1}
      page={page + 1} // MUI page is 0-indexed, so we add 1 for display
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1); // MUI page is 0-indexed, so we subtract 1 for internal handling
      }}
    />
  );
};

const CustomPagination = (props) => {
  // This component is used to customize the pagination of the DataGridPremium
  return (
    <GridPagination
      ActionsComponent={MultiplePagesDisplayPagination}
      {...props}
    />
  );
};

export default CustomPagination;
