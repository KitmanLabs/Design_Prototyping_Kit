import Button from '@mui/material/Button';
import i18n from '@kitman/common/src/utils/i18n';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';


const AthleteSelectorDrawerFooter = (props) => {
  return (
    <>
      <Divider />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "flex-end",
          p: 2
        }}>
        <Button
          variant="contained"
          onClick={props.onDone}
          disabled={props.selectedIds.size === 0}
        >
          {i18n.t('Done')}
        </Button>
      </Stack>
    </>
  );
};

export default AthleteSelectorDrawerFooter;
