import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import AvailabilityLabel from '.';

// Ported from kitman-playbook components/AvailabilityLabel/__tests__/AvailabilityLabel.test.tsx.
describe('<AvailabilityLabel />', () => {
  describe('[feature-flag] dsr-availability-status', () => {
    it.each([
      { availability: 'available', unavailableSince: null, expectedStatus: 'Available' },
      { availability: 'injured', unavailableSince: '11 days', expectedStatus: 'Available (Injured/Ill)' },
      { availability: 'absent', unavailableSince: '3 days', expectedStatus: 'Unavailable (Absent)' },
      { availability: 'unavailable', unavailableSince: '2 days', expectedStatus: 'Unavailable (Injured/Ill)' },
    ])('renders "$expectedStatus" when athlete is $availability', ({ availability, unavailableSince, expectedStatus }) => {
      render(<AvailabilityLabel status={{ availability, unavailable_since: unavailableSince }} availabilityStatusEnabled />);
      expect(screen.getByText(expectedStatus)).toBeInTheDocument();
    });

    it('displays unavailable_since when athlete is injured', () => {
      render(<AvailabilityLabel status={{ availability: 'injured', unavailable_since: '11 days' }} availabilityStatusEnabled />);
      expect(screen.getByText('11 days')).toBeInTheDocument();
    });

    it('does not display unavailable_since when athlete is available', () => {
      render(<AvailabilityLabel status={{ availability: 'available', unavailable_since: null }} availabilityStatusEnabled />);
      expect(screen.queryByText(/days/)).not.toBeInTheDocument();
    });
  });

  describe('with dsr-availability-status disabled', () => {
    it('renders the plain "Unavailable" label for unavailable status', () => {
      render(<AvailabilityLabel status={{ availability: 'unavailable', unavailable_since: '2 days' }} />);
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
    });

    it('treats absent as Available (no dedicated absent label)', () => {
      render(<AvailabilityLabel status={{ availability: 'absent', unavailable_since: '3 days' }} />);
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.queryByText(/days/)).not.toBeInTheDocument();
    });
  });

  // The kit's generated athletes carry "0 days" when available, as iP sends it.
  it('hides the "0 days" iP sends for an available athlete', () => {
    render(<AvailabilityLabel status={{ availability: 'available', unavailable_since: '0 days' }} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.queryByText('0 days')).not.toBeInTheDocument();
  });
});
