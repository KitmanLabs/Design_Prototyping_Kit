import { withTranslation } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { rootTheme } from '@kitman/playbook/themes';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Ported from kitman-playbook components/AvailabilityLabel/index.tsx (main, 3 Sep 2026), types
// removed. status.availability is one of available, unavailable, injured, returning, absent or
// ill. availabilityStatusEnabled is iP's dsr-availability-status flag, which selects the newer
// wording ("Unavailable (Injured/Ill)", "Unavailable (Absent)"); without it, absent shows as
// Available and ill falls back to Available too, as in iP.
const getStatusTextAndColour = (availability, availabilityStatusEnabled) => {
  const availableStatus = {
    label: i18n.t('Available'),
    colour: rootTheme.palette.success.main,
  };
  switch (availability) {
    case 'absent':
      return availabilityStatusEnabled
        ? {
            label: i18n.t('Unavailable (Absent)'),
            colour: rootTheme.palette.error.light,
          }
        : availableStatus;
    case 'unavailable':
      return {
        label: availabilityStatusEnabled
          ? i18n.t('Unavailable (Injured/Ill)')
          : i18n.t('Unavailable'),
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

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  label: {
    color: 'var(--color-white)',
    borderRadius: 9999,
    fontSize: '0.78rem',
    paddingInline: '0.375rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  unavailableSince: {
    fontSize: '0.8163rem',
    letterSpacing: '0.0272rem',
  },
};

const AvailabilityLabel = ({ status, availabilityStatusEnabled = false }) => {
  const { availability, unavailable_since: unavailableSince } = status;

  const availabilityInfo = getStatusTextAndColour(availability, availabilityStatusEnabled);

  return (
    <Box sx={styles.wrapper} data-testid="Storybook|AvailabilityLabel">
      <Box
        component="span"
        sx={{
          backgroundColor: availabilityInfo.colour,
          ...styles.label,
        }}
      >
        {availabilityInfo.label}
      </Box>

      {availabilityInfo.label !== i18n.t('Available') && unavailableSince && (
        <Typography sx={styles.unavailableSince}>{unavailableSince}</Typography>
      )}
    </Box>
  );
};

export default AvailabilityLabel;
export const AvailabilityLabelTranslated = withTranslation()(AvailabilityLabel);
