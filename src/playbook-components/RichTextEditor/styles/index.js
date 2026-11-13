import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import sizeStyles from '../utils';

const getStyles = ({
  theme,
  focused = false,
  disabled = false,
  error = false,
  size = 'small',
  label = '',
  optionalText = '',
}) => {
  const palette = theme.palette;
  const typography = theme.typography;

  return {
    wrapper: css`
      width: 100%;

      ${disabled &&
      `
        cursor: not-allowed;
      `}

      .remirror-theme {
        width: 100%;
        font-family: ${typography.fontFamily};
      }

      ${disabled &&
      `
        opacity: 0.9;
      `}
    `,
    label: css`
      color: ${palette.text.primary};
      background-color: rgba(0, 0, 0, 0.13);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      > label,
      > div {
        font-size: 12px;
      }

      ${!label &&
      `
        justify-content: flex-end;
      `}

      ${error &&
      `
        > label {
          color: ${palette.error.main};
        }
      `}
    `,
    toolbar: css`
      background-color: rgba(0, 0, 0, 0.11);
      border-bottom: 1px solid ${palette.secondary.dark};
      pointer-events: none;
      transition: border 0.4s ease;

      ${(label || optionalText) &&
      `
        border-top: 1px solid ${palette.secondary.dark};
      `}

      ${!label &&
      !optionalText &&
      `
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      `}

      ${focused &&
      `
        pointer-events: auto;
      `}

      button {
        color: ${palette.primary.main};
        border-top: 0;
        border-bottom: 0;

        ${(label || optionalText) &&
        `
          border-radius: 0;
        `}

        &:first-of-type {
          border-left: 0;
          border-bottom-left-radius: 0;
        }

        &:last-of-type {
          border-radius: 0;
        }

        &.Mui-disabled {
          border-top: 0;
          border-bottom: 0;
        }

        &#strikethrough {
          border-right-width: 2px;
        }

        &#heading-level-1 {
          width: 35px;
        }
        &#heading-level-2 {
          width: 35px;
          border-right-width: 2px;
        }
      }
    `,
    editor: css`
      font-size: ${sizeStyles[size].p.fontSize};
      color: ${palette.text.primary};
      background-color: ${colors.light_transparent_background};
      padding: 12px;
      min-height: 100px;
      position: relative;
      transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

      ${error &&
      `
        color: ${palette.error.main};
      `}

      ${!focused &&
      !disabled &&
      `
        &:hover {
          background-color: rgba(0, 0, 0, 0.09);
        }
      `}

      &:before {
        border-bottom: 1px solid ${colors.grey_100_50};
        left: 0;
        bottom: 0;
        content: '';
        position: absolute;
        right: 0;
        transition: border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        pointer-events: none;
      }

      &:after {
        border-bottom: 2px solid ${palette.text.primary};
        left: 0;
        bottom: 0;
        content: '';
        position: absolute;
        right: 0;
        transform: scaleX(0);
        transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
        pointer-events: none;
      }

      ${!error &&
      !disabled &&
      `
        &:hover:before {
          border-bottom: 1px solid ${palette.text.primary};
        }
      `}

      ${error &&
      `
        &:before {
          border-bottom-color: ${palette.error.main};
        }
        &:after {
          border-bottom-color: ${palette.error.main};
        }
      `}

      ${focused &&
      `
        overflow-y: auto;
        resize: vertical;

        &:after {
          transform: scaleX(1) translateX(0);
        }
      `}
  
      .remirror-editor-wrapper {
        padding-top: 0;

        .ProseMirror.remirror-editor {
          padding: 0;
          box-shadow: none;
          min-height: 100px;

          h1 {
            font-size: ${sizeStyles[size].h1.fontSize};
          }
          h2 {
            font-size: ${sizeStyles[size].h2.fontSize};
          }

          .remirror-is-empty:first-of-type::before {
            font-style: unset;
            font-family: ${typography.fontFamily};
            color: rgba(0, 0, 0, 0.3);
          }
        }
      }
    `,
    footer: css`
      display: flex;
      align-items: center;
      margin-top: 3px;
    `,
    errorText: css`
      color: ${palette.error.main};
      margin-right: 14px;
      margin-left: 14px;
    `,
    charLimitIndicator: css`
      color: ${palette.text.primary};
    `,
  };
};

export default getStyles;
