import { useMemo } from 'react';
import { getTruncatedText } from '../utils';
import {
  MAX_TITLE_CHARS_MOBILE,
  MAX_VISIBLE_BADGES_DESKTOP,
  MAX_VISIBLE_BADGES_MOBILE,
} from '../constants';



export const useHeaderData = (
  params
) => {
  const { display: titleDisplay, isTruncated: isTitleTruncated } =
    params.isMobile
      ? getTruncatedText(params.title, MAX_TITLE_CHARS_MOBILE)
      : { display: params.title, isTruncated: false };

  const allBadges = params.badges || [];
  const maxVisibleBadges = params.isMobile
    ? MAX_VISIBLE_BADGES_MOBILE
    : MAX_VISIBLE_BADGES_DESKTOP;
  const visibleBadges = allBadges.slice(0, maxVisibleBadges);
  const overflowBadges = allBadges.slice(maxVisibleBadges);

  const mainAction = params.isMobile
    ? params.primaryAction || params.secondaryAction
    : null;

  const desktopSecondaryVisible = !params.isMobile && !!params.secondaryAction;
  const desktopPrimaryVisible = !params.isMobile && !!params.primaryAction;
  const desktopTertiaryVisible = !params.isMobile && !!params.tertiaryAction;

  const generalMenuActions = useMemo(() => {
    if (params.isMobile) {
      const extra = [];
      if (params.primaryAction && params.secondaryAction) {
        extra.push(params.secondaryAction);
      }
      if (params.tertiaryAction) {
        extra.push(params.tertiaryAction);
      }
      if (params.moreActions && params.moreActions.length > 0) {
        extra.push(...params.moreActions);
      }
      return extra;
    }
    return params.moreActions || [];
  }, [
    params.isMobile,
    params.primaryAction,
    params.secondaryAction,
    params.moreActions,
    params.tertiaryAction,
  ]);

  const exportMenuActions =
    params.isAvailableToExport && params.exportActions
      ? params.exportActions
      : [];

  const hasAnyMenuItems =
    generalMenuActions.length > 0 || exportMenuActions.length > 0;

  return {
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
  };
};
