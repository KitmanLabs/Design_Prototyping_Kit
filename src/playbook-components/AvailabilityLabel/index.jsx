import { withTranslation } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { rootTheme } from '@kitman/playbook/themes';
import { Box, Typography } from '@kitman/playbook/components';



const getStatusTextAndColour = (
  availability
) => {
  const availableStatus = {
    label: i18n.t('Available'),
    colour: rootTheme.palette.success.main,
  };
  switch (availability) {
    case 'unavailable':
      return {
        label: i18n.t('Unavailable'),
        colour: rootTheme.palette.error.light,
      };
    case 'injured':
      return {
        label: i18n.t('Available (Injured/Ill)'),
        colour: rootTheme.palette.warning.light,
      };
    case 'returning':
      return {
        label: i18n.t('Available (Returning from injury/illness)'),
        colour: rootTheme.palette.warning.lighter,
      };
    case 'available':
      return availableStatus;
    default:
      return availableStatus;
  }
};

const StatusIndicator = ({ colour }) => (
  <Box
    sx={{
      width: '0.544rem',
      height: '0.544rem',
      borderRadius: '50%',
      alignSelf: 'center',
      background: colour,
    }}
  />
);

const AvailabilityLabel = ({ status }) => {
  const { availability, unavailable_since: unavailableSince } = status;
  const availabilityInfo = getStatusTextAndColour(availability);

  const labelStyle = {
    fontSize: '0.9525rem',
    textTransform: 'capitalize',
    letterSpacing: '0.0116rem',
  };
  const unavailableSinceStyle = {
    fontSize: '0.8163rem',
    letterSpacing: '0.0272rem',
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row' }}
      data-testid="Storybook|AvailabilityLabel"
    >
      {availabilityInfo.colour && (
        <StatusIndicator colour={availabilityInfo.colour} />
      )}
      <Box sx={{ marginLeft: '0.75rem' }}>
        <Typography sx={labelStyle}>{availabilityInfo.label}</Typography>
        {availabilityInfo.label !== 'available' && unavailableSince && (
          <Typography sx={unavailableSinceStyle}>{unavailableSince}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AvailabilityLabel;
export const AvailabilityLabelTranslated = withTranslation()(AvailabilityLabel);
