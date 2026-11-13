import { ConfirmationModal, DialogContentText } from '../playbook-components'

/**
 * The one discard confirmation. Cancel, close and navigating away with unsaved changes all
 * go through it, so unsaved work is never lost silently.
 */
function DiscardChangesDialog({ open, onDiscard, onKeepEditing, description = 'Your changes will be lost.' }) {
  return (
    <ConfirmationModal
      isModalOpen={open}
      onClose={onKeepEditing}
      onCancel={onKeepEditing}
      onConfirm={onDiscard}
      isDeleteAction
      dialogContent={<DialogContentText id="confirm-action-dialog-description">{description}</DialogContentText>}
      translatedText={{
        title: 'Discard unsaved changes?',
        actions: { cancelButton: 'Keep editing', ctaButton: 'Discard' },
      }}
    />
  )
}

export default DiscardChangesDialog
