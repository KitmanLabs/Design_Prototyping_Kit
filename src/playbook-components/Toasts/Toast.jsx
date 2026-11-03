import { useRef, useEffect } from 'react';
import Link from '@mui/material/Link';
import { Box, Slide, Alert, AlertTitle } from '@mui/material';
import { toastRemovalDelayEnumLike } from './toastTypes';


const Toast = ({ toast, onClose, onLinkClick, toastRemovalDelay }) => {
  const toastTimer = useRef(null);

  const { id, status, title, description, links } = toast;
  // Allows toastRemovalDelay to be configured when rendering Toast, or
  // via redux dispatch
  const removalDelay = toastRemovalDelay ?? toast.removalDelay;

  useEffect(() => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    if (status !== 'LOADING') {
      toastTimer.current = setTimeout(
        () => {
          onClose(id);
        },
        removalDelay
          ? toastRemovalDelayEnumLike[removalDelay]
          : toastRemovalDelayEnumLike.DefaultRemovalDelay
      );
    }

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, [id, onClose, status]);

  return (
    <Slide in direction="left" mountOnEnter unmountOnExit>
      <Alert
        onClose={() => onClose(id)}
        severity={status === 'LOADING' ? 'info' : (status || 'info').toLowerCase()}
        sx={{ maxWidth: '350px' }}
        elevation={3}
      >
        <AlertTitle sx={{ mb: description ? 0.7 : 0 }}>{title}</AlertTitle>
        {description}

        {links && links.length > 0 && (
          <Box
            mt={description ? 2 : 1}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              'div:not(:last-child)': {
                marginRight: '6px',
              },
            }}
          >
            {links.map((link) => (
              <Box key={link.id}>
                <Link
                  href={link.link}
                  onClick={(event) => {
                    if (
                      typeof onLinkClick === 'function' &&
                      link.metadata?.action
                    ) {
                      onLinkClick(link);
                      event.preventDefault();
                    }
                  }}
                >
                  {link.text}
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Alert>
    </Slide>
  );
};

export default Toast;
