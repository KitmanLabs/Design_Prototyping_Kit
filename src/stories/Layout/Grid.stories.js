import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
} from '../../playbook-components';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/system/react-box',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=4662-14&mode=design&t=IavrGog2hIvepYYn-0',
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default {
  title: 'Layout/Grid',
  component: Grid,
  render: ({ ...args }) => (
    <Box sx={{ width: 800 }}>
      <Grid {...args} container spacing={2}>
        <Grid xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid xs={5}>
          <Item>xs=5</Item>
        </Grid>
        <Grid xs={7}>
          <Item>xs=7</Item>
        </Grid>
      </Grid>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      description: 'Direction options',
    },
    justifyContent: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      description: 'Justify content options',
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      description: 'Align items options',
    },
  },
};

export const Story = {
  args: {
    direction: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
};

export const WithSpacingBetweenGrids = () => {
  const [spacing, setSpacing] = useState(2);

  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={spacing}>
          {[0, 1, 2].map((value) => (
            <Grid key={value} item>
              <Paper
                sx={{
                  height: 140,
                  width: 100,
                  backgroundColor: 'lightblue',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Grid container justifyContent="center">
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">spacing</FormLabel>
                <RadioGroup
                  name="spacing"
                  aria-label="spacing"
                  value={spacing.toString()}
                  onChange={handleChange}
                  row
                >
                  {[0, 0.5, 1, 2, 3, 4, 8, 12].map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value.toString()}
                      control={<Radio />}
                      label={value.toString()}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export const WithCustomColumnNumber = () => (
  <Box sx={{ width: 800 }}>
    <Grid container spacing={2} columns={16}>
      <Grid xs={8}>
        <Item>xs=8</Item>
      </Grid>
      <Grid xs={8}>
        <Item>xs=8</Item>
      </Grid>
      <Grid xs={4}>
        <Item>xs=4</Item>
      </Grid>
      <Grid xs={12}>
        <Item>xs=12</Item>
      </Grid>
    </Grid>
  </Box>
);
