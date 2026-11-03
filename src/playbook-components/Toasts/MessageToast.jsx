/**
 * Simple MessageToast component (replaces @kitman/modules MessageToast)
 */
import React from 'react';
import Toast from './Toast';

export function MessageToast({ toast, onClose }) {
  return <Toast toast={toast} onClose={onClose} />;
}

export const MessageToastTranslated = MessageToast;
