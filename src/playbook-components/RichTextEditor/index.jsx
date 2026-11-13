import { forwardRef, useImperativeHandle, useState } from 'react';
import { withTranslation } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  PlaceholderExtension,
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  StrikeExtension,
  OrderedListExtension,
  BulletListExtension,
  HeadingExtension,
} from 'remirror/extensions';
import { CountExtension } from '@remirror/extension-count';

import {
  Remirror,
  useRemirror,
  EditorComponent,
  useRemirrorContext,
} from '@remirror/react';
import { prosemirrorNodeToHtml } from 'remirror';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@kitman/playbook/components';
import getStyles from './styles';
import Toolbar from './components/Toolbar';
import { CharacterLimitExtension } from './extensions/CharacterLimitExtension';


const RichTextEditor = (props) => {
  const emptyHTMLeditorContent = '<p></p>';
  const characterLimit = props.charLimit || 65535;

  const theme = useTheme();

  const [focused, setFocused] = useState(false);
  const [remainingChars, setRemainingChars] = useState(characterLimit);

  const styles = getStyles({
    theme,
    focused,
    disabled: props.disabled || false,
    error: props.error || false,
    size: props.size || 'medium',
    label: props.label,
    optionalText: props.optionalText,
  });

  const { manager, state, setState } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new UnderlineExtension(),
      new StrikeExtension(),
      new OrderedListExtension(),
      new BulletListExtension(),
      ...(props.charLimit
        ? [new CharacterLimitExtension({ limit: props.charLimit })]
        : []),
      ...(props.placeholder
        ? [new PlaceholderExtension({ placeholder: props.placeholder })]
        : []),
      ...(props.showHeadingButtons ? [new HeadingExtension()] : []),
    ],
    content: props.value || emptyHTMLeditorContent,
    selection: 'start',
    stringHandler: 'html',
  });

  const handleEditorChange = (parameter) => {
    const html = prosemirrorNodeToHtml(parameter.state.doc);

    if (props.charLimit) {
      const count = new CountExtension();
      const currentContentCount = count.getCharacterCount(parameter.state);
      setRemainingChars(characterLimit - currentContentCount);
    }
    setState(parameter.state);
    props.onChange(html);
  };

  /*
   * the `forwardedRef` prop can be used to set the value
   * programmatically from outside as:
   *
   * forwardedRef.current?.setContent(
   *   'The new value'
   * );
   *
   * https://remirror.io/docs/faq/#q-how-to-replace-the-content-in-the-editor
   */
  const ImperativeHandle = forwardRef((_, ref) => {
    const { setContent } = useRemirrorContext({
      autoUpdate: true,
    });

    useImperativeHandle(ref, () => ({ setContent }));

    return <></>;
  });

  const renderRemainingCharacters = () => {
    return (
      props.charLimit &&
      remainingChars <= props.charLimit && (
        <div css={styles.charLimitIndicator}>
          <Typography variant="caption" component="div">
            {`${remainingChars} ${
              remainingChars !== 1
                ? i18n.t('characters left')
                : i18n.t('character left')
            }`}
          </Typography>
        </div>
      )
    );
  };

  const handleOnBlur = (newState, event) => {
    if (
      event &&
      event.relatedTarget &&
      event.relatedTarget.tagName === 'BUTTON' &&
      event.relatedTarget.className.includes(`MuiToggleButton`)
    ) {
      event.preventDefault();
    } else {
      setFocused(false);
    }
  };

  return (
    <div css={styles.wrapper}>
      <div className="remirror-theme">
        <Remirror
          manager={manager}
          state={state}
          onChange={handleEditorChange}
          onFocus={() => setFocused(true)}
          onBlur={handleOnBlur}
          editable={!props.disabled}
        >
          {props.forwardedRef && <ImperativeHandle ref={props.forwardedRef} />}
          {(props.label || props.optionalText) && (
            <div css={styles.label}>
              {props.label && (
                <Typography component="label">{props.label}</Typography>
              )}
              {props.optionalText && (
                <Typography component="div">{props.optionalText}</Typography>
              )}
            </div>
          )}
          <div css={styles.toolbar}>
            <Toolbar
              focused={focused}
              disabled={props.disabled}
              showHeadingButtons={props.showHeadingButtons}
            />
          </div>
          <div css={styles.editor}>
            <EditorComponent />
          </div>
          {(props.error && props.errorText) || props.charLimit ? (
            <div
              css={[
                styles.footer,
                {
                  justifyContent:
                    props.error && props.errorText
                      ? 'space-between'
                      : 'flex-end',
                },
              ]}
            >
              {props.error && props.errorText && (
                <div css={styles.errorText}>
                  <Typography variant="caption" component="div">
                    {props.errorText}
                  </Typography>
                </div>
              )}
              {props.charLimit ? renderRemainingCharacters() : null}
            </div>
          ) : null}
        </Remirror>
      </div>
    </div>
  );
};

export const RichTextEditorTranslated = withTranslation()(RichTextEditor);
export default RichTextEditor;
