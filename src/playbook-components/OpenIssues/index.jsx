import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { TextLink } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { colors, breakPoints } from '@kitman/common/src/variables';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { withTranslation } from 'react-i18next';
import { getOpenIssuesForAthleteByDate } from '@kitman/services/src/services/medical';
import { SentryCaptureMessage } from '@kitman/common/src/utils';
import { getIssueTypePath } from '@kitman/modules/src/Medical/shared/utils';

const availabilityColors = {
  available: colors.green_200,
  unavailable: colors.red_100,
  injured: colors.orange_100,
  returning: colors.yellow_100,
};

const getAvailabilityDotColor = (availability) =>
  availabilityColors[availability] || 'grey';

const styles = {
  error: {
    fontSize: convertPixelsToREM(12),
    color: colors.red_100,
  },
  issuesContainer: {
    display: 'flex',
    width: convertPixelsToREM(400),
    flexDirection: 'column',
    [`@media (max-width: ${breakPoints.tablet})`]: {
      width: convertPixelsToREM(250),
    },
  },
  issue: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.135em',
  },
  issueName: {
    ml: 2,
    fontSize: convertPixelsToREM(14),
    fontWeight: 600,
    color: colors.grey_200,
    whiteSpace: 'pre-line',
  },
  issueStatus: {
    ml: 2,
    fontSize: convertPixelsToREM(12),
    color: colors.grey_100,
  },
  availabilityMarker: {
    mr: 0.5,
    mt: 0.5,
    alignItems: 'center',
    border: `${convertPixelsToREM(2)} solid ${colors.p06}`,
    borderRadius: convertPixelsToREM(10),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    '@media (min-width: 960px)': {
      mt: 0.75,
      mr: 0.75,
    },
  },
  availabilityDot: (issueAvailability) => ({
    borderRadius: convertPixelsToREM(10),
    display: 'block',
    height: convertPixelsToREM(8),
    width: convertPixelsToREM(8),
    backgroundColor: getAvailabilityDotColor(issueAvailability),
  }),
  toggleIssuesRender: {
    fontSize: convertPixelsToREM(12),
    '&:hover': {
      fontWeight: 600,
      backgroundColor: 'unset',
      fontSize: convertPixelsToREM(14),
    },
  },
};

const Issue = ({
  athleteId,
  openIssue,
  issueAvailability,
  canViewAvailabilities,
}) => (
  <Box key={openIssue.id} sx={styles.issue}>
    {canViewAvailabilities && (
      <Box sx={styles.availabilityMarker}>
        <Box sx={styles.availabilityDot(issueAvailability)} />
      </Box>
    )}
    <Typography variant="body2" sx={styles.issueName}>
      <TextLink
        text={openIssue.name}
        href={`/medical/athletes/${athleteId}/${getIssueTypePath(
          openIssue.issue_type
        )}/${openIssue.id}`}
        kitmanDesignSystem
      />
    </Typography>
    <Typography variant="caption" sx={styles.issueStatus}>
      {openIssue.status}
    </Typography>
  </Box>
);


const OpenIssues = (props) => {
  const { permissions } = usePermissions();
  const [issues, setIssues] = useState(props.openIssues);
  const [hasMore, setHasMore] = useState(props.hasMore);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (props.openIssues.length > 0 && props.openIssues !== issues) {
      setIssues(props.openIssues);
    }
  }, [props.openIssues]);

  const loadMoreIssues = () => {
    setErrorMessage('');
    setLoading(true);
    getOpenIssuesForAthleteByDate(props.athleteId, props.issueDate)
      .then((data) => {
        setIssues(data.issues);
        setHasMore(false);
      })
      .catch(() => {
        setErrorMessage(props.t('Something went wrong loading athlete issues'));
        SentryCaptureMessage(
          `Error fetching athlete(id: ${props.athleteId}) open issues: ${
            props.athleteId
          } ${props.issueDate ? `using date param: ${props.issueDate}` : ''}`,
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'auto',
      }}
    >
      <Box sx={styles.issuesContainer}>
        {issues.map((openIssue) => (
          <Issue
            key={openIssue.id}
            athleteId={props.athleteId}
            openIssue={openIssue}
            issueAvailability={
              openIssue.causing_unavailability ? 'unavailable' : 'available'
            }
            canViewAvailabilities={!!permissions.medical.availability.canView}
            t={props.t}
          />
        ))}
        {hasMore && !loading && (
          <Box>
            <Button
              size="small"
              variant="text"
              sx={styles.toggleIssuesRender}
              onClick={loadMoreIssues}
            >
              {props.t('Show all')}
            </Button>
          </Box>
        )}
        {issues.length > props.openIssues.length && (
          <Box>
            <Button
              size="small"
              variant="text"
              sx={styles.toggleIssuesRender}
              onClick={() => {
                setIssues(props.openIssues);
                setHasMore(true);
              }}
            >
              {props.t('Show less')}
            </Button>
          </Box>
        )}
        {loading && (
          <Typography variant="caption">
            {props.t('Loading injury/ illness')}
          </Typography>
        )}
        {errorMessage && !loading && (
          <Typography variant="caption" sx={styles.error}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const OpenIssuesTranslated = withTranslation()(OpenIssues);
export default OpenIssues;
