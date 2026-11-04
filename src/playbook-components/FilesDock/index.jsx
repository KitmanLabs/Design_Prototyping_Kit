import { withTranslation } from 'react-i18next';
import { colors, zIndices } from '@kitman/common/src/variables';
import classNames from 'classnames';
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';



const FilesDock = ({
  filesToUpload,
  filesDockRef = null,
  fitContent = false,
  hideTitle = false,
  hideRemoveAction = false,
  handleRemoveFile = undefined,
  t,
}) => {
  const renderStatus = (status, progressPercentage) => {
    switch (status) {
      case 'inprogress': {
        return (
          <>
            <Typography variant="body2" sx={{
              color: "primary.main"
            }}>
              {`${t('Processing')}...`}
            </Typography>
            <Box sx={{ width: '40%' }}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
              />
            </Box>
          </>
        );
      }
      case 'uploaded': {
        return (
          <Typography variant="body2" sx={{
            color: "primary.main"
          }}>
            {`${t('Confirming')}...`}
          </Typography>
        );
      }

      case 'confirmed': {
        return (
          <Typography variant="body2" sx={{
            color: "success.main"
          }}>
            {t('Completed')}
          </Typography>
        );
      }
      case 'errored': {
        return (
          <Typography variant="body2" color="error">
            {t('Error! Please remove this file and try again.')}
          </Typography>
        );
      }
      default: {
        return null;
      }
    }
  };

  const renderFile = ({
    id,
    name,
    type,
    size,
    status,
    progressPercentage,
    onRemoveFile,
    url = null,
  }) => {
    const canRemoveFile =
      !hideRemoveAction &&
      ['pending', 'confirmed', 'errored', 'queued'].includes(status);

    return (
      <ListItem
        key={id}
        disableGutters
        secondaryAction={
          <>
            {url && (
              <Tooltip
                title={t('Preview')}
                slotProps={{
                  popper: {
                    sx: { zIndex: zIndices.toastDialog },
                  },
                }}
              >
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => window.open(url, '_blank').focus()}
                  sx={{ mr: '3px' }}
                >
                  <KitmanIcon
                    color="primary"
                    name={KITMAN_ICON_NAMES.OpenInNewOutlined}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            )}
            {canRemoveFile && (
              <Tooltip
                title={t('Remove')}
                slotProps={{
                  popper: {
                    sx: { zIndex: zIndices.toastDialog },
                  },
                }}
              >
                <IconButton edge="end" size="small" onClick={onRemoveFile}>
                  <KitmanIcon
                    color="primary"
                    name={KITMAN_ICON_NAMES.DeleteOutline}
                  />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
      >
        <ListItemAvatar>
          <Avatar sx={{ width: 35, height: 35, bgcolor: colors.neutral_300 }}>
            <i className={classNames(getNewContentTypeColorfulIcons(type))} />
          </Avatar>
        </ListItemAvatar>
        <></>
        <Stack spacing={0} sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{
            color: "primary.main"
          }}>
            {`${name} - ${fileSizeLabel(size, true)}`}
          </Typography>
          {!url && renderStatus(status, progressPercentage)}
        </Stack>
      </ListItem>
    );
  };

  if (filesToUpload.length === 0) {
    return null;
  }

  return (
    <Box ref={filesDockRef} sx={{ width: fitContent ? 'fit-content' : '100%' }}>
      {!hideTitle && (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            mt: 2,
            fontWeight: 500
          }}>
          {t('Attached')}
        </Typography>
      )}
      <List dense>
        {filesToUpload.map((managedFile) => {
          const { id, file } = managedFile.file;
          return renderFile({
            id,
            name: file.name,
            type: file.type,
            size: file.size,
            status: managedFile.status,
            progressPercentage: managedFile.progressPercentage,
            onRemoveFile: () => {
              handleRemoveFile(id.toString());
            },
          });
        })}
      </List>
    </Box>
  );
};

export const FilesDockTranslated =
  withTranslation()(FilesDock);
export default FilesDock;
