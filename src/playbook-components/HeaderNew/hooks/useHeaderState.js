import { useState, useRef } from 'react';


export function useHeaderState(isMobile) {
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const isMoreOpen = Boolean(moreAnchorEl);

  const [titleTooltipOpen, setTitleTooltipOpen] = useState(false);
  const [listItemTooltipId, setListItemTooltipId] = useState(null);
  const [attachmentTooltipId, setAttachmentTooltipId] = useState(null);
  const [badgesTooltipOpen, setBadgesTooltipOpen] = useState(false);

  const isInteractiveClickRef = useRef(false);

  const handleMoreOpen = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleClickAway = (event) => {
    if (!isMobile) return;

    if (isInteractiveClickRef.current) {
      isInteractiveClickRef.current = false;
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[role="tooltip"]')) return;

    setTitleTooltipOpen(false);
    setListItemTooltipId(null);
    setAttachmentTooltipId(null);
    setBadgesTooltipOpen(false);
  };

  return {
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
  };
}
