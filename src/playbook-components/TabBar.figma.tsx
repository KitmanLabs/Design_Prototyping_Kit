import figma from '@figma/code-connect';
import TabBar from './TabBar';

figma.connect(
  TabBar,
  'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL?node-id=6579-45197',
  {
    props: {
      tabs: figma.children('*'),
    },
    example: () => (
      <TabBar
        tabs={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' },
          { label: 'Tab 3', value: 'tab3' },
        ]}
        value="tab1"
        onChange={(_, newValue) => {}}
      />
    ),
  }
);
