/**
 * Listbox component for Autocomplete (replaces @kitman/playbook/utils/Autocomplete VirtualizedListboxComponent).
 * Non-virtualized listbox that forwards ref and renders children.
 */
import React from 'react';

const VirtualizedListboxComponent = React.forwardRef(function VirtualizedListboxComponent(
  { children, ...props },
  ref
) {
  return (
    <ul ref={ref} role="listbox" {...props} style={{ maxHeight: 300, overflow: 'auto', ...props.style }}>
      {children}
    </ul>
  );
});

export { VirtualizedListboxComponent };
