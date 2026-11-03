import { withTranslation } from 'react-i18next';
import { renderToString } from 'react-dom/server';
import { useState } from 'react';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';

import { colors } from '@kitman/common/src/variables';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { useTheme } from '@mui/material/styles';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box, Button, Typography, Alert } from '@kitman/playbook/components';
import { DocumentScannerTranslated as DocumentScanner } from '@kitman/components/src/DocumentScanner';
import { filePondSx } from '@kitman/playbook/components/FileUploads/style';



// TODO: Suggest change to an interface for AttachedFile instead of multiple types


registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename
);

const FileUploads = ({
  filePondRef,
  acceptedFileTypes,
  disabled,
  onAddFile,
  onWarning,
  onError,
  allowScanning = false,
  maxFileSize = '300MB',
  acceptedFileTypesLabel,
  validationErrors,
  maxFiles = null,
  resetValidation,
  validationErrorsAreaRef,
  t,
}) => {
  const theme = useTheme();
  const totalFilesSelected = filePondRef.current?.getFiles?.().length || 0;

  const [showDocumentScanner, setShowDocumentScanner] = useState(false);

  const hasValidationErrors = validationErrors && validationErrors.length > 0;

  const getIdleLabel = () => {
    return renderToString(
      <>
        <KitmanIcon name={KITMAN_ICON_NAMES.UploadFile} />
        <Typography fontFamily={theme.typography.fontFamily}>
          <span className="filepond--label-action">{t('Click to upload')}</span>
          {t(' or drag and drop')}
        </Typography>
        {acceptedFileTypesLabel && (
          <Typography
            fontFamily={theme.typography.fontFamily}
            color={colors.grey_300}
            sx={{
              fontSize: `${convertPixelsToREM(14)}!important`,
              fontWeight: 400,
            }}
          >
            {acceptedFileTypesLabel}
            {maxFileSize &&
              t(' (max. {{maxFileSize}})', {
                maxFileSize,
              })}
          </Typography>
        )}
        {!!maxFiles && (
          <Typography
            fontFamily={theme.typography.fontFamily}
            color={colors.grey_300}
            sx={{
              fontSize: `${convertPixelsToREM(14)}!important`,
              fontWeight: 400,
            }}
          >
            {t(`(max files: {{maxNumberOfFiles}})`, {
              maxFiles,
            })}
          </Typography>
        )}
      </>
    );
  };

  const renderMaxFilesReachedWarning = () => (
    <Box>
      <Alert severity="warning">
        {t(
          'The maximum number of files allowed ({{maxFiles}}) has been reached.',
          { maxFiles }
        )}
      </Alert>
    </Box>
  );

  const renderValidationErrors = () => (
    <div ref={validationErrorsAreaRef}>
      {validationErrors?.map((validation, index) => (
        <Box key={validation.fileId || index}>
          <Alert
            severity={validation.severity}
            onClose={() =>
              resetValidation?.(validation.fileName, validation.fileId)
            }
          >
            {validation.issue}
          </Alert>
        </Box>
      ))}
    </div>
  );

  return (
    <>
      {allowScanning && (maxFiles == null || totalFilesSelected < maxFiles) && (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Button variant="text" onClick={() => setShowDocumentScanner(true)}>
            {t('Scan document')}
          </Button>
        </div>
      )}
      <Box
        sx={{
          ...(hasValidationErrors && {
            border: '1px solid',
            borderColor: 'error.main',
          }),
        }}
        data-testid={hasValidationErrors ? 'validation-error' : undefined}
      >
        <Box
          sx={{
            ...filePondSx,
            ...(totalFilesSelected === maxFiles && { display: 'none' }),
          }}
          data-testid={
            totalFilesSelected === maxFiles ? 'FilePond-hidden' : undefined
          }
        >
          <FilePond
            disabled={disabled}
            acceptedFileTypes={acceptedFileTypes}
            allowDrop
            allowFileSizeValidation
            allowFileTypeValidation
            allowImagePreview={false}
            allowMultiple
            dropOnPage
            dropValidation={false}
            instantUpload={false}
            labelIdle={getIdleLabel()}
            labelMaxFileSizeExceeded={t('File is too large')}
            maxFiles={maxFiles || 10}
            maxFileSize={maxFileSize}
            onerror={onError}
            onwarning={onWarning}
            ref={filePondRef}
            removeFilesWithErrors
            onaddfile={(error, file) => {
              if (error) {
                onError?.(error, file);
                filePondRef.current?.removeFile(file);
              } else {
                onAddFile(file);
              }
            }}
          />
        </Box>
      </Box>
      {totalFilesSelected === maxFiles && renderMaxFilesReachedWarning()}
      {hasValidationErrors && renderValidationErrors()}
      <DocumentScanner
        isOpen={showDocumentScanner}
        onCancel={() => setShowDocumentScanner(false)}
        onSave={(file) => {
          filePondRef.current?.addFile?.(file);
          setShowDocumentScanner(false);
        }}
      />
    </>
  );
};

export const FileUploadsTranslated =
  withTranslation()(FileUploads);
export default FileUploads;
