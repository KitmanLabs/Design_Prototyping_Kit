import { useEffect } from 'react';

// Hook to detect clicks outside a referenced element and call a handler
// I am not using our existing useClickOutside hook because it is not compatible with multi open date pickers

export function useClickOutside(
  ref,
  handler
) {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current ||
        !(event.target instanceof Node) ||
        ref.current.contains(event.target)
      ) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
