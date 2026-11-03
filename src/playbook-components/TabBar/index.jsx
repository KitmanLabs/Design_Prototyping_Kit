import { rootTheme } from '@kitman/playbook/themes';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { Box, Tabs, Tab } from '@kitman/playbook/components';

const TabPanel = ({
  value,
  tabKey,
  tabHash,
  children,
  customStyles = {},
  ...other
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== tabHash}
      id={`tabpanel-${tabKey}`}
      aria-labelledby={`tab-${tabKey}`}
      {...other}
      sx={customStyles.tabPanelRoot}
    >
      {value === tabHash && <Box sx={customStyles.tabPanel}>{children}</Box>}
    </Box>
  );
};

const a11yProps = (tabKey) => {
  return {
    id: `tab-${tabKey}`,
    'aria-controls': `tabpanel-${tabKey}`,
  };
};


export const TabBar = ({
  value = '',
  tabs = [],
  onChange,
  variant = 'standard',
  customStyles = {},
}) => {
  return (
    <Box
      id="TabBarRoot"
      sx={{
        ...customStyles.tabBarRoot,
        width: '100%',
      }}
    >
      <Box id="TabBar" sx={customStyles.tabBar}>
        <Box
          id="Tabs"
          sx={{ pl: 3, backgroundColor: rootTheme.palette.common.white }}
        >
          <Tabs
            variant={variant}
            value={value}
            onChange={(e, tabHash) => onChange?.(tabHash)}
            sx={{
              minHeight: convertPixelsToREM(40),
            }}
          >
            {tabs.map(({ tabKey, tabHash, title }) => (
              <Tab
                key={`tab-${tabKey}`}
                label={title}
                value={tabHash}
                sx={{
                  px: convertPixelsToREM(8),
                  pt: convertPixelsToREM(7.5),
                  pb: convertPixelsToREM(9.5),
                  minWidth: 'unset',
                  minHeight: convertPixelsToREM(40),
                }}
                {...a11yProps(tabKey)}
              />
            ))}
          </Tabs>
        </Box>
        <Box id="TabPanelsRoot" sx={customStyles.tabPanelsRoot}>
          {tabs.map(({ tabKey, tabHash, content }) => (
            <TabPanel
              key={`tabpanel-${tabKey}`}
              value={value}
              tabKey={tabKey}
              tabHash={tabHash}
              customStyles={customStyles}
            >
              {content}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TabBar;
