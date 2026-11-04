import { withTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Stack,
  Tooltip,
  Typography,
} from '@kitman/playbook/components';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import colors from '@kitman/common/src/variables/colors';

import { useHeaderState } from './hooks/useHeaderState';
import { useHeaderData } from './hooks/useHeaderData';
import { TitleSection } from './components/TitleSection';
import BadgesSection from './components/BadgesSection';
import AttachmentsSection from './components/AttachmentsSection';
import { ActionsMenu } from './components/ActionsMenu';
import { getTruncatedText } from './utils';
import { AVATAR_SIZE } from './constants';

function ResponsivePageHeader(props) {
  const {
    title,
    onBackClick,
    showBackButton,
    showAvatar,
    avatarSrc,
    avatarAlt,
    listItems,
    showListItems,
    badges,
    showBadges,
    primaryAction,
    secondaryAction,
    tertiaryAction,
    moreActions,
    exportActions,
    isAvailableToExport,
    showActions,
    attachments,
    attachedLinks,
    showAttachments,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const {
    moreAnchorEl,
    isMoreOpen,
    titleTooltipOpen,
    listItemTooltipId,
    attachmentTooltipId,
    badgesTooltipOpen,
    isInteractiveClickRef,
    setTitleTooltipOpen,
    setListItemTooltipId,
    setAttachmentTooltipId,
    setBadgesTooltipOpen,
    handleMoreOpen,
    handleMoreClose,
    handleClickAway,
  } = useHeaderState(isMobile);

  // Data computations
  const {
    titleDisplay,
    isTitleTruncated,
    visibleBadges,
    overflowBadges,
    mainAction,
    desktopSecondaryVisible,
    desktopPrimaryVisible,
    desktopTertiaryVisible,
    generalMenuActions,
    exportMenuActions,
    hasAnyMenuItems,
  } = useHeaderData({
    isMobile,
    title,
    badges,
    primaryAction,
    secondaryAction,
    tertiaryAction,
    moreActions,
    exportActions,
    isAvailableToExport,
  });

  // Handle menu item click
  const handleMoreItemClick = (action) => {
    action.onClick();
    handleMoreClose();
  };

  const shouldShowSection =(
    items,
    showFlag
  ) => {
    return Boolean(items?.length) && showFlag !== false;
  };

  const shouldShowBackButton = Boolean(onBackClick) && showBackButton !== false;
  const shouldShowAvatar = Boolean(avatarSrc) && showAvatar !== false;
  const shouldShowListItems = shouldShowSection(listItems, showListItems);
  const shouldShowBadges = shouldShowSection(badges, showBadges);
  const shouldShowAttachments =
    shouldShowSection(attachments, showAttachments) ||
    shouldShowSection(attachedLinks, showAttachments);
  const shouldShowActions = showActions !== false;

  const PrimaryActionComponent = primaryAction?.component ?? null;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          backgroundColor: colors.p06,
          borderColor: 'divider',
        }}
      >
        <Stack direction="column" spacing={1}>
          {/* Top row: Back button and mobile actions */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            {shouldShowBackButton && (
              <Button
                onClick={onBackClick}
                size="small"
                variant="text"
                startIcon={<ArrowBackIosNewIcon fontSize="small" />}
              >
                {props.t('Back')}
              </Button>
            )}

            {/* Mobile actions */}
            {shouldShowActions && isMobile && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  flexShrink: 0
                }}>
                {mainAction && (
                  <>
                    {PrimaryActionComponent ? (
                      <PrimaryActionComponent
                        {...(mainAction?.props ?? {})}
                        onClick={mainAction.onClick}
                        disabled={mainAction.disabled}
                        label={mainAction.label}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={mainAction.onClick}
                        disabled={mainAction.disabled}
                      >
                        {mainAction.label}
                      </Button>
                    )}
                  </>
                )}

                {hasAnyMenuItems && (
                  <ActionsMenu
                    generalActions={generalMenuActions}
                    exportActions={exportMenuActions}
                    anchorEl={moreAnchorEl}
                    isOpen={isMoreOpen}
                    onOpen={handleMoreOpen}
                    onClose={handleMoreClose}
                    onItemClick={handleMoreItemClick}
                  />
                )}
              </Stack>
            )}
          </Stack>

          {/* Main content row */}
          <Stack direction="row" spacing={2}>
            {/* Avatar */}
            {shouldShowAvatar && (
              <Avatar
                src={avatarSrc}
                alt={avatarAlt || ''}
                sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              />
            )}

            {/* Title, list items, and badges */}
            <Box sx={{ overflow: 'hidden' }}>
              <TitleSection
                titleDisplay={titleDisplay}
                isTitleTruncated={isTitleTruncated}
                fullTitle={title}
                isMobile={isMobile}
                titleTooltipOpen={titleTooltipOpen}
                setTitleTooltipOpen={setTitleTooltipOpen}
                isInteractiveClickRef={isInteractiveClickRef}
              />

              {/* List items */}
              {shouldShowListItems && listItems && (
                <Box
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    flexWrap: { xs: 'nowrap', md: 'wrap' },
                    overflowX: 'auto',
                  }}
                >
                  {listItems.map((item) => {
                    const { display, isTruncated } = getTruncatedText(
                      item.value
                    );

                    const content = (
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {props.t(item.label)}:{' '}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {display}
                        </Typography>
                      </Typography>
                    );

                    return (
                      <Box key={item.id} sx={{ mr: 2, flexShrink: 0 }}>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {isTruncated ? (
                          isMobile ? (
                            <Box
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                isInteractiveClickRef.current = true;
                                setListItemTooltipId((prev) =>
                                  prev === item.id ? null : item.id
                                );
                              }}
                              sx={{ cursor: 'pointer' }}
                            >
                              <Tooltip
                                title={item.value}
                                placement="bottom"
                                open={listItemTooltipId === item.id}
                                onClose={() => setListItemTooltipId(null)}
                                disableHoverListener
                                disableFocusListener
                                disableTouchListener
                              >
                                <span>{content}</span>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Tooltip title={item.value} placement="bottom">
                              <span>{content}</span>
                            </Tooltip>
                          )
                        ) : (
                          content
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Badges */}
              {shouldShowBadges && (
                <BadgesSection
                  visibleBadges={visibleBadges}
                  overflowBadges={overflowBadges}
                  isMobile={isMobile}
                  badgesTooltipOpen={badgesTooltipOpen}
                  setBadgesTooltipOpen={setBadgesTooltipOpen}
                  isInteractiveClickRef={isInteractiveClickRef}
                />
              )}

              {/* Attachments and Links */}
              {shouldShowAttachments && (
                <AttachmentsSection
                  attachments={attachments ?? []}
                  attachedLinks={attachedLinks ?? []}
                  isMobile={isMobile}
                  attachmentTooltipId={attachmentTooltipId}
                  setAttachmentTooltipId={setAttachmentTooltipId}
                  isInteractiveClickRef={isInteractiveClickRef}
                />
              )}
            </Box>

            {/* Desktop actions */}
            {shouldShowActions && !isMobile && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "baseline",
                  flexShrink: 0,
                  marginLeft: 'auto !important'
                }}>
                {desktopPrimaryVisible &&
                  primaryAction &&
                  (PrimaryActionComponent ? (
                    <PrimaryActionComponent
                      {...(primaryAction?.props ?? {})}
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.disabled}
                      label={primaryAction.label}
                    />
                  ) : (
                    desktopPrimaryVisible &&
                    primaryAction && (
                      <Button
                        variant="contained"
                        color={primaryAction?.props?.btnColor ?? 'primary'}
                        size="medium"
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.disabled}
                      >
                        {primaryAction.label}
                      </Button>
                    )
                  ))}

                {desktopSecondaryVisible && secondaryAction && (
                  <Button
                    color={secondaryAction?.props?.btnColor ?? 'secondary'}
                    size="medium"
                    onClick={secondaryAction.onClick}
                    disabled={secondaryAction.disabled}
                  >
                    {secondaryAction.label}
                  </Button>
                )}

                {desktopTertiaryVisible && tertiaryAction && (
                  <Button
                    color={tertiaryAction?.props?.btnColor ?? 'secondary'}
                    size="medium"
                    onClick={tertiaryAction.onClick}
                    disabled={tertiaryAction.disabled}
                  >
                    {tertiaryAction.label}
                  </Button>
                )}

                {hasAnyMenuItems && (
                  <ActionsMenu
                    generalActions={generalMenuActions}
                    exportActions={exportMenuActions}
                    anchorEl={moreAnchorEl}
                    isOpen={isMoreOpen}
                    onOpen={handleMoreOpen}
                    onClose={handleMoreClose}
                    onItemClick={handleMoreItemClick}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </ClickAwayListener>
  );
}

export const ResponsivePageHeaderTranslated =
  withTranslation()(ResponsivePageHeader);
export default ResponsivePageHeader;
