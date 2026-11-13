import { useState } from 'react';
import { Box, TextField } from '../../playbook-components';
import { GuidedFlowLayout, FloorplanFooter, PageFrame, PageHeader } from '../../floorplans';
import { logInjurySteps } from '../../data/injuryOptions';

const Demo = ({ startStep }) => {
  const [step, setStep] = useState(startStep);
  const isLast = step === logInjurySteps.length - 1;

  return (
    <Box sx={{ height: 620, overflow: 'auto', border: '1px dashed var(--color-border-primary)' }}>
      <PageFrame
        header={<PageHeader title="Log injury" onBackClick={() => {}} />}
        footer={
          <FloorplanFooter
            onCancel={() => {}}
            actions={[
              { id: 'draft', label: 'Save draft', onClick: () => {} },
              ...(step > 0 ? [{ id: 'back', label: 'Back', onClick: () => setStep(step - 1) }] : []),
            ]}
            primaryAction={isLast ? { label: 'Submit', onClick: () => {} } : { label: 'Next', onClick: () => setStep(step + 1) }}
          />
        }
      >
        <GuidedFlowLayout steps={logInjurySteps} activeStep={step} furthestStep={step} onStepClick={setStep}>
          <TextField variant="filled" fullWidth label="A field for this step" />
        </GuidedFlowLayout>
      </PageFrame>
    </Box>
  );
};

export default {
  title: 'Floorplans/Guided flow',
  component: GuidedFlowLayout,
  render: (args) => <Demo {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A step rail and one step at a time, for 3 to 8 dependent steps ending in Review. Completed steps can be revisited from the rail. Below the md breakpoint the rail becomes a progress bar. The footer holds Cancel, Save draft, Back and Next.',
      },
    },
  },
  tags: ['autodocs'],
  args: { startStep: 0 },
};

export const FirstStep = {};

export const Review = { args: { startStep: 4 } };
