import {
  PickersLayoutRoot,
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import {
  Box,
  PickersDay,
  TextField,
  Chip,
  Grid2 as Grid,
  Typography,
} from '@kitman/playbook/components';
import { usePickerLayout } from '@kitman/playbook/hooks';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';

export function CustomTextField({ selections, ...rest }) {
  const multiDateTextFieldValue = selections
    .map((date) => formatShort(date))
    .join(', ');
  return <TextField {...rest} value={multiDateTextFieldValue} />;
}

export function MultiDayRenderer({ selections, onClick, ...rest }) {
  const selected = !!selections.find((selectedDate) =>
    selectedDate.isSame(rest.day, 'date')
  );

  return (
    <PickersDay
      {...rest}
      selected={selected}
      onClick={() => {
        onClick(rest.day, selected);
      }}
    />
  );
}

export function CustomLayout({
  selections,
  handleDateDelete,
  selectionAreaTitle,
  ...rest
}) {
  const { toolbar, tabs, content, actionBar } = usePickerLayout(rest);

  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={rest}>
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
      >
        {tabs}
        {content}
        <Box m="4px" width="100%">
          <Typography
            variant="subtitle1"
            fontWeight={400}
            sx={{ color: 'text.primary', fontSize: '14px' }}
          >
            {selectionAreaTitle}
          </Typography>
          <Grid
            container
            sx={{ width: '320px', maxHeight: '120px', overflow: 'auto' }}
            columns={2}
            gap="1px"
          >
            {selections.map((date) => {
              const dateString = formatShort(date);
              return (
                <Grid size={1} key={dateString}>
                  <Box m="auto" width="100%">
                    <Chip
                      label={dateString}
                      onDelete={() => handleDateDelete(date)}
                      size="small"
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}
