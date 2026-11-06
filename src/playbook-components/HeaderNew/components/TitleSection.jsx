import { Tooltip, Typography } from '@kitman/playbook/components';


export function TitleSection(props) {
  const {
    titleDisplay,
    isTitleTruncated,
    fullTitle,
    isMobile,
    titleTooltipOpen,
    setTitleTooltipOpen,
    isInteractiveClickRef,
  } = props;

  const titleTypography = (
    <Typography variant={isMobile ? 'h6' : 'h5'} component="h1" noWrap>
      {titleDisplay}
    </Typography>
  );

  if (!isTitleTruncated) {
    return titleTypography;
  }

  if (isMobile) {
    return (
      <Tooltip
        title={fullTitle}
        placement="bottom"
        open={titleTooltipOpen}
        onClose={() => setTitleTooltipOpen(false)}
        disableHoverListener
        disableFocusListener
        disableTouchListener
      >
        <span
          onMouseDown={(e) => {
            e.stopPropagation();
            isInteractiveClickRef.current = true;
          }}
          onClick={(e) => {
            e.stopPropagation();
            setTitleTooltipOpen((prev) => !prev);
          }}
          style={{ cursor: 'pointer' }}
        >
          {titleTypography}
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={fullTitle} placement="bottom">
      <span>{titleTypography}</span>
    </Tooltip>
  );
}