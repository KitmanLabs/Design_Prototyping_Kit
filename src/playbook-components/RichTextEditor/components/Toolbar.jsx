import {
  useActive,
  useChainedCommands,
  useCommands,
} from '@remirror/react';
import {
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@kitman/playbook/components';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
} from '@mui/icons-material';
import {
  HeadingLevel1Svg,
  HeadingLevel2Svg,
} from '@kitman/playbook/components/RichTextEditor/icons';


const Toolbar = (props) => {
  const chain = useChainedCommands();
  const active = useActive();
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    toggleBulletList,
    toggleOrderedList,
    toggleHeading,
  } = useCommands();

  const size = 'small';
  const activeActions = [
    ...(active.bold() ? ['bold'] : []),
    ...(active.italic() ? ['italic'] : []),
    ...(active.underline() ? ['underline'] : []),
    ...(active.strike() ? ['strikethrough'] : []),
    ...(active.bulletList() ? ['bulleted-list'] : []),
    ...(active.orderedList() ? ['ordered-list'] : []),
  ];

  if (props.showHeadingButtons) {
    if (active.heading({ level: 1 })) {
      activeActions.push('heading-level-1');
    }
    if (active.heading({ level: 2 })) {
      activeActions.push('heading-level-2');
    }
  }

  const inlineActions = [
    {
      id: 'bold',
      tooltipText: 'Bold',
      icon: <FormatBold fontSize={size} />,
      active: active.bold(),
      disabled: !toggleBold.enabled(),
      hidden: false,
      onClick: () => chain.toggleBold().focus().run(),
    },
    {
      id: 'italic',
      tooltipText: 'Italic',
      icon: <FormatItalic fontSize={size} />,
      active: active.italic(),
      disabled: !toggleItalic.enabled(),
      hidden: false,
      onClick: () => chain.toggleItalic().focus().run(),
    },
    {
      id: 'underline',
      tooltipText: 'Underline',
      icon: <FormatUnderlined fontSize={size} />,
      active: active.underline(),
      disabled: !toggleUnderline.enabled(),
      hidden: false,
      onClick: () => chain.toggleUnderline().focus().run(),
    },
    {
      id: 'strikethrough',
      tooltipText: 'Strikethrough',
      icon: <FormatStrikethrough fontSize={size} />,
      active: active.strike(),
      disabled: !toggleStrike.enabled(),
      hidden: false,
      onClick: () => chain.toggleStrike().focus().run(),
    },
  ];

  const headingActions = [
    {
      id: 'heading-level-1',
      tooltipText: 'Heading 1',
      icon: HeadingLevel1Svg(),
      active: props.showHeadingButtons && active.heading({ level: 1 }),
      disabled:
        props.showHeadingButtons && !toggleHeading.enabled({ level: 1 }),
      hidden: !props.showHeadingButtons,
      onClick: () => chain.toggleHeading({ level: 1 }).focus().run(),
    },
    {
      id: 'heading-level-2',
      tooltipText: 'Heading 2',
      icon: HeadingLevel2Svg(),
      active: props.showHeadingButtons && active.heading({ level: 2 }),
      disabled:
        props.showHeadingButtons && !toggleHeading.enabled({ level: 2 }),
      hidden: !props.showHeadingButtons,
      onClick: () => chain.toggleHeading({ level: 2 }).focus().run(),
    },
  ];

  const blockActions = [
    {
      id: 'bulleted-list',
      tooltipText: 'Bulleted list',
      icon: <FormatListBulleted fontSize={size} />,
      active: active.bulletList(),
      disabled: !toggleBulletList.enabled(),
      hidden: false,
      onClick: () => chain.toggleBulletList().focus().run(),
    },
    {
      id: 'ordered-list',
      tooltipText: 'Ordered list',
      icon: <FormatListNumbered fontSize={size} />,
      active: active.orderedList(),
      disabled: !toggleOrderedList.enabled(),
      hidden: false,
      onClick: () => chain.toggleOrderedList().focus().run(),
    },
  ];

  const toolbarActions = [];

  toolbarActions.push(
    inlineActions
      .concat(headingActions)
      .concat(blockActions)
      .filter((action) => !action.hidden)
      .map((action) => {
        return (
          <ToggleButton
            id={action.id}
            key={action.id}
            value={action.id}
            disabled={props.disabled || action.disabled}
            onClick={action.onClick}
          >
            <Tooltip title={action.tooltipText}>{action.icon}</Tooltip>
          </ToggleButton>
        );
      })
  );

  return (
    <ToggleButtonGroup size={size} value={props.focused ? activeActions : []}>
      {toolbarActions}
    </ToggleButtonGroup>
  );
};

export default Toolbar;
