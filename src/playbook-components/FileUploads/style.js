import { colors } from '@kitman/common/src/variables';

export const filePondSx = {
  '& .filepond--panel-root': {
    backgroundColor: 'transparent',
    borderRadius: '4px',
    border: '1px dashed rgba(59, 73, 96, 0.12)',
  },
  '& .filepond--drop-label': {
    height: '150px',
    color: colors.grey_200,
    svg: {
      fontSize: '24px',
      mb: 1,
    },
  },
  '& .filepond--credits': {
    display: 'none',
  },
  '& .filepond--list': {
    display: 'none',
  },
};
