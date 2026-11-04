import { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from '@kitman/playbook/components';
import {
  docFileTypes,
  imageFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import { colors } from '@kitman/common/src/variables';
import { withTranslation } from 'react-i18next';
import { KITMAN_ICON_NAMES, KitmanIcon } from '../../icons';

const isImage = (type) => type.startsWith('image/');

const DEFAULT_MAX_FILES = 1;
const DEFAULT_FILE_TYPES = [...docFileTypes, ...imageFileTypes];



const DefaultTitle = ({ t }) => (
  <Typography
    sx={{
      color: "text.primary",
      mt: '16px'
    }}>
    <span style={{ textDecoration: 'underline' }}>{t('Click to upload')}</span>{' '}
    {t('or gran and drop')}
  </Typography>
);

export default function FileDropzone({
  t = (str) => str, // fallback if the file is imported without translations
  value,
  setValue,
  fileTypes = DEFAULT_FILE_TYPES,
  maxFiles = DEFAULT_MAX_FILES,
  subtitle,
  title,
  validateFile,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [inputError, setInputError] = useState(null);

  useEffect(() => {
    if (!value || value.length === 0) {
      setPreviews([]);
      return;
    }

    const loadPreviews = async () => {
      const previewPromises = value.map(
        (file) =>
          new Promise((resolve) => {
            const error = validateFile ? validateFile(file) : null;
            const fileSizeKb = file.size / 1024;

            if (!isImage(file.type)) {
              resolve({
                name: file.name,
                size: Math.round(fileSizeKb),
                type: file.type,
                preview: null,
                error,
              });
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                size: Math.round(fileSizeKb),
                type: file.type,
                preview: reader.result,
                error,
              });
            };
            reader.readAsDataURL(file);
          })
      );

      const resolvedPreviews = await Promise.all(previewPromises);
      setPreviews(resolvedPreviews);
    };

    loadPreviews();
  }, [validateFile, value]);

  const handleFileAdd = (file) => {
    setInputError('');

    if (fileTypes?.length && !fileTypes.includes(file.type)) {
      setInputError(t('Unsupported file.'));
      return;
    }

    if (value.length >= maxFiles) {
      const newValue = [...value.slice(0, -1), file];
      setValue(newValue);
    } else {
      setValue([...value, file]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) {
      return;
    }

    Array.from(droppedFiles).forEach(handleFileAdd);
  };

  const handleInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) {
      return;
    }

    Array.from(selectedFiles).forEach(handleFileAdd);

    // Reset input so the same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (index) => {
    setValue(value.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{
      paddingBottom: 1
    }}>
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        sx={{
          height: 156,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: inputError ? colors.red_50 : null,
          border: inputError
            ? `1px solid ${colors.red_200}`
            : '1px solid transparent',
          borderImage: inputError
            ? null
            : `repeating-linear-gradient(
            45deg,
            ${colors.grey_200_12} 0 4px,
            transparent 4px 8px
          )`,
          borderImageSlice: inputError ? null : 1,
        }}
      >
        <input
          ref={inputRef}
          data-testid="file-dropzone-input"
          type="file"
          multiple
          hidden
          accept={fileTypes.join(',')}
          onChange={handleInputChange}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <KitmanIcon
            name={KITMAN_ICON_NAMES.UploadFile}
            sx={{ fill: inputError ? colors.red_200 : colors.grey_200 }}
          />
          {title || <DefaultTitle t={t} />}
          {subtitle && <Typography>{subtitle}</Typography>}
          {inputError && (
            <Typography
              sx={{
                color: "error.main",
                fontSize: 12
              }}>
              {inputError}
            </Typography>
          )}
        </Box>
      </Box>

      {previews.map((file, index) => (
        <Card
          key={`${file.name}-${file.size}`}
          sx={{
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            paddingY: 1,
            paddingX: 2,
          }}
        >
          <Avatar
            variant="square"
            src={file.preview ?? undefined}
            sx={{
              width: 56,
              height: 56,
              marginRight: 2,
              background: 'transparent',
            }}
          >
            {!file.preview && (
              <KitmanIcon
                name={KITMAN_ICON_NAMES.InsertDriveFileOutlined}
                sx={{ fill: colors.grey_200 }}
              />
            )}
          </Avatar>
          <CardContent sx={{ flexGrow: 1, p: 1 }}>
            <Typography variant="body2">{file.name}</Typography>
            {!file.error && (
              <Typography variant="caption" sx={{
                color: "text.secondary"
              }}>
                {file.size} kb &#8226; {t('Completed')}
              </Typography>
            )}
            {file.error && (
              <Typography variant="caption" sx={{
                color: "error.main"
              }}>
                {file.error} &#8226; {t('Failed')}
              </Typography>
            )}
          </CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1
            }}>
            <IconButton onClick={() => handleRemove(index)}>
              <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
            </IconButton>
            {!file.error && (
              <KitmanIcon
                name={KITMAN_ICON_NAMES.CheckCircle}
                sx={{ fill: colors.green_200 }}
              />
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export const FileDropzoneTranslated = withTranslation()(FileDropzone);
