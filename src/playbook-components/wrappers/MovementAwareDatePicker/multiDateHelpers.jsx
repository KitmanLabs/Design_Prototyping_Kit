import {
  PickersLayoutRoot,
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import {
  Box,
  PickerDay,
  TextField,
  Chip,
  Grid,
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
    <PickerDay
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
        <Box
          sx={{
            m: "4px",
            width: "100%"
          }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 400,
              color: 'text.primary',
              fontSize: '14px'
            }}>
            {selectionAreaTitle}
          </Typography>
          <Grid
            container
            columns={2}
            sx={{
              gap: "1px",
              width: '320px',
              maxHeight: '120px',
              overflow: 'auto'
            }}>
            {selections.map((date) => {
              const dateString = formatShort(date);
              return (
                <Grid size={1} key={dateString}>
                  <Box
                    sx={{
                      m: "auto",
                      width: "100%"
                    }}>
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
