import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
} from '@kitman/playbook/components';
import { zIndices } from '@kitman/common/src/variables';
import ConditionalWrapper from '@kitman/components/src/ConditionalWrapper/index';

export const modalTitleId = 'confirm-action-dialog-title';
export const modalDescriptionId = 'confirm-action-dialog-description'; // should be used with DialogContentText


export const ConfirmationModal = ({
  isModalOpen,
  onClose,
  onConfirm,
  onCancel,
  isLoading,
  dialogContent,
  translatedText: { title, actions },
  isDeleteAction = false,
  fullWidth = false,
  maxWidth = false,
  disableCtaButton = false,
}) => {
  return (
    <Dialog
      open={isModalOpen}
      onClose={onClose}
      aria-labelledby={modalTitleId}
      aria-describedby={modalDescriptionId}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      sx={{
        zIndex: zIndices.modal,
      }}
    >
      <DialogTitle id={modalTitleId}>{title}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} color="secondary" disabled={isLoading}>
            {actions.cancelButton}
          </Button>
        )}
        <ConditionalWrapper
          condition={Boolean(actions.ctaButtonTooltip)}
          wrapper={(children) => (
            <Tooltip
              title={actions.ctaButtonTooltip}
              placement="top"
              arrow
              slotProps={{
                popper: {
                  sx: {
                    zIndex: zIndices.tooltip,
                  },
                },
              }}
            >
              {/* span is required to wrap Button to enable tooltip on disabled element
              docs: https://mui.com/material-ui/react-tooltip/#disabled-elements
          */}
              <span
                css={{
                  marginLeft: '8px',
                  cursor: disableCtaButton ? 'not-allowed' : 'pointer',
                }}
              >
                {children}
              </span>
            </Tooltip>
          )}
        >
          <Button
            onClick={onConfirm}
            color={isDeleteAction ? 'error' : 'primary'}
            disabled={disableCtaButton}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              actions.ctaButton
            )}
          </Button>
        </ConditionalWrapper>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
