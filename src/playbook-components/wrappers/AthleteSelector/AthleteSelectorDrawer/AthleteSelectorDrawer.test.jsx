import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AthleteSelectorDrawer from '.';

// The drawer used to call a mixin stubbed as {}, so it threw on render.
describe('<AthleteSelectorDrawer />', () => {
  it('opens as a labelled dialog', () => {
    render(<AthleteSelectorDrawer open onClose={() => {}}>Athletes go here</AthleteSelectorDrawer>);
    expect(screen.getByRole('dialog', { name: 'Select athletes' })).toBeInTheDocument();
    expect(screen.getByText('Athletes go here')).toBeInTheDocument();
  });
});
