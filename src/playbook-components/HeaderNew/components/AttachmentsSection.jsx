import { Box, Link, Tooltip, Typography } from '@kitman/playbook/components';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import colors from '@kitman/common/src/variables/colors';

import { getTruncatedText } from '../utils';


const getMuiIcon = (fileType, isExternal = false) => {
  if (isExternal) {
    return <LinkOutlinedIcon fontSize="small" color="text.secondary" />;
  }
  if (!fileType) {
    return <AttachFileOutlinedIcon fontSize="small" />;
  }
  const lowerType = fileType.toLowerCase();
  if (lowerType.startsWith('image/')) {
    return (
      <ImageOutlinedIcon fontSize="small" sx={{ color: colors.red_100 }} />
    );
  }
  if (lowerType.startsWith('video/')) {
    return (
      <VideoFileOutlinedIcon fontSize="small" sx={{ color: colors.teal_100 }} />
    );
  }
  if (lowerType.startsWith('audio/')) {
    return (
      <AudioFileOutlinedIcon
        fontSize="small"
        sx={{ color: colors.purple_100 }}
      />
    );
  }
  if (
    lowerType.includes('pdf') ||
    lowerType.includes('document') ||
    lowerType.includes('text')
  ) {
    return (
      <DescriptionOutlinedIcon
        fontSize="small"
        sx={{ color: colors.blue_100 }}
      />
    );
  }
  return <AttachFileOutlinedIcon fontSize="small" />;
};
const AttachmentsSection = (props) => {
  const hasAttachments = props.attachments.length > 0;
  const hasLinks = props.attachedLinks.length > 0;

  if (!hasAttachments && !hasLinks) {
    return null;
  }

  const renderAttachmentLink = ({
    id,
    name,
    uri,
    fileType,
    isExternal = false,
  }) => {
    const { display, isTruncated } = getTruncatedText(name ?? '');

    const linkContent = (
      <Link
        href={uri}
        target={isExternal ? '_blank' : undefined}
        rel="noreferrer"
        underline="hover"
        className="planningEventHeader__attachments"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {getMuiIcon(fileType ?? '', isExternal)}
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {display}
        </Typography>
      </Link>
    );

    if (!isTruncated) {
      return (
        <Box key={id} sx={{ flexShrink: 0 }}>
          {linkContent}
        </Box>
      );
    }

    if (props.isMobile) {
      return (
        <Box
          key={id}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // eslint-disable-next-line no-param-reassign
            props.isInteractiveClickRef.current = true;
            props.setAttachmentTooltipId((prev) => (prev === id ? null : id));
          }}
          sx={{ cursor: 'pointer', flexShrink: 0 }}
        >
          <Tooltip
            title={name}
            placement="bottom"
            open={props.attachmentTooltipId === id}
            onClose={() => props.setAttachmentTooltipId(null)}
            disableHoverListener
            disableFocusListener
            disableTouchListener
          >
            <span>{linkContent}</span>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box key={id} sx={{ flexShrink: 0 }}>
        <Tooltip title={name} placement="bottom">
          <span>{linkContent}</span>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        mt: 0.5,
        display: 'flex',
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: 'auto',
        gap: 3,
        alignItems: 'center',
      }}
    >
      {hasAttachments &&
        props.attachments.map((eventAttachment) => {
          const { id, name, url, filetype } = eventAttachment.attachment;
          return renderAttachmentLink({
            id: String(id),
            name,
            uri: url,
            fileType: filetype,
            isExternal: false,
          });
        })}

      {hasLinks &&
        props.attachedLinks.map((eventLink) => {
          const { id, title, uri } = eventLink.attached_link;
          return renderAttachmentLink({
            id: String(id),
            name: title,
            uri,
            fileType: 'link',
            isExternal: true,
          });
        })}
    </Box>
  );
};

export default AttachmentsSection;
