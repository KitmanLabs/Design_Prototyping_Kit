import { zIndices } from '@kitman/common/src/variables';

// Ported from kitman-playbook mixins/drawerMixins/index.ts (main), types removed. iP's side
// drawers are 460px wide by default and full width below the sm breakpoint.

export const isOpenMixin = ({ theme, drawerWidth }) => ({
  width: '100vw',
  [theme.breakpoints.up('sm')]: {
    width: drawerWidth,
  },
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

export const isClosedMixin = ({ theme }) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const drawerPositionMixin = ({ theme }) => ({
  position: 'fixed',
  right: '0px',
  top: '0px',
  [theme.breakpoints.up('lg')]: {
    right: '0px',
    top: '0px',
  },
});

export const drawerMixin = ({ theme, isOpen, drawerWidth = 460 }) => {
  return {
    height: `100vh`,
    flexShrink: 0,
    p: 2,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    zIndex: zIndices.drawer,
    '& .MuiDrawer-root': {
      ...drawerPositionMixin({ theme }),
      height: `100vh`,
      width: '100vw',
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
      },
    },

    ...(isOpen && {
      ...isOpenMixin({ theme, drawerWidth }),
      '& .MuiDrawer-paper': isOpenMixin({ theme, drawerWidth }),
      display: 'flex',
    }),
    ...(!isOpen && {
      ...isClosedMixin({ theme }),
    }),
  };
};
