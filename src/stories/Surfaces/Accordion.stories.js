import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
} from '../../playbook-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const docs = {
  muiLink: 'https://mui.com/material-ui/react-accordion/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=6583-45995&mode=design&t=QLenttbW1XEfaEEc-0',
};

export default {
  title: 'Surfaces/Accordion',
  component: Accordion,
  render: ({ ...args }) => {
    const copyOfArgs = { ...args };
    if (!args.expanded) {
      delete copyOfArgs.expanded;
    }
    return (
      <div>
        <Accordion
          {...copyOfArgs}
          key={JSON.stringify({
            expanded: args.expanded,
            defaultExpanded: args.defaultExpanded,
          })}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Accordion</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
          <AccordionActions>
            <Button>Cancel</Button>
            <Button>Agree</Button>
          </AccordionActions>
        </Accordion>
      </div>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    expanded: {
      control: 'boolean',
      description:
        'If true, expands the accordion, otherwise collapse it. Setting this prop enables control over the accordion',
      table: {
        defaultValue: { summary: false },
      },
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'If true, expands the accordion by default',
      table: {
        defaultValue: { summary: false },
      },
    },
    square: {
      control: 'boolean',
      description: 'If true, rounded corners are disabled',
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled',
      table: {
        defaultValue: { summary: false },
      },
    },
    disableGutters: {
      control: 'boolean',
      description:
        'If true, it removes the margin between two expanded accordion items and the increase of height',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
};

export const Story = {
  args: {
    expanded: false,
    defaultExpanded: false,
    square: false,
    disabled: false,
    disableGutters: false,
  },
};

export const WithExpandedByDefault = () => (
  <div>
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography>Expanded by default</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography>Header</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  </div>
);

export const WithDisabledItem = () => (
  <div>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography>Accordion 1</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Typography>Accordion 2</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion disabled>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3-content"
        id="panel3-header"
      >
        <Typography>Disabled Accordion</Typography>
      </AccordionSummary>
    </Accordion>
  </div>
);
