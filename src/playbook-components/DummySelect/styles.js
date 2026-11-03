import colors from '@kitman/common/src/variables/colors';
import zIndices from '@kitman/common/src/variables/zIndices';

const getStyles = (isOpen) => ({
  dummySelect: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  label: {
    color: colors.grey_100,
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '4px',
  },
  buttonContainer: {
    width: '100%',
    height: 32,
    backgroundColor: colors.neutral_200,
    borderRadius: 3,

    ...(isOpen && {
      backgroundColor: colors.white,
      borderColor: colors.blue_100,
      boxShadow: `0 0 0 2px ${colors.blue_100}`,
    }),
  },
  button: {
    width: '100%',
    height: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.125rem 0.5rem',
    overflow: 'hidden',
    textWrap: 'nowrap',
  },
  icon: {
    color: colors.grey_200,
    fontSize: '0.875rem',
    stroke: colors.grey_200,
    strokeWidth: '0.8px',
  },
  menu: {
    width: '100%',
    position: 'absolute',
    background: colors.white,
    padding: '0.5rem',
    boxShadow:
      '0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)',
    borderRadius: 3,
    top: '100%',
    marginTop: '0.5rem',
    zIndex: zIndices.selectMenu,
  },
});

export default getStyles;
