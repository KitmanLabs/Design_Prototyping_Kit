/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import {
  Button,
  ConfirmationModal,
  DialogContentText,
} from '../../playbook-components';
import { modalDescriptionId } from '../../playbook-components/ConfirmationModal';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-dialog/',
  figmaLink:
    'https://www.figma.com/design/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?node-id=12191-8014&t=gcJuitlyu32kfvY4-0',
};

export default {
  title: 'Feedback/ConfirmationModal',
  component: ConfirmationModal,
  render: ({ isDeleteAction, isLoading, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClickOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const dialogContent = (
      <DialogContentText id={modalDescriptionId}>
        Confirmation Dialog Content
        <ul>
          <li>Some bullet point with info</li>
          <li>Another bullet point with info</li>
        </ul>
      </DialogContentText>
    );

    return (
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open Confirmation Modal
        </Button>
        <ConfirmationModal
          isModalOpen={isOpen}
          onClose={handleClose}
          onCancel={handleClose}
          onConfirm={() => {}}
          isLoading={isLoading}
          isDeleteAction={isDeleteAction}
          dialogContent={dialogContent}
          translatedText={{
            title: title ?? 'Modal Title',
            actions: {
              ctaButton: 'Confirm',
              cancelButton: 'Cancel',
            },
          }}
        />
      </>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    title: {
      control: 'text',
      defaultValue: '',
      description: 'The title of the confirmation modal',
    },
    isDeleteAction: {
      control: 'boolean',
      defaultValue: false,
      description: 'Will the CTA button cause a delete action',
    },
    isLoading: {
      control: 'boolean',
      defaultValue: false,
      description:
        'Has the CTA action been called and an asynchronous action is being run',
    },
  },
};

export const Story = {
  args: {},
};
