import { useState } from 'react';
import { formatDateInput } from '../utils';


// Custom hook to handle keyboard input in the date range text field

export function useDateInput({ updateDateRange, organisationLocale }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const input = e.target.value;
    const numbers = input.replace(/\D/g, '');

    if (numbers.length <= 16) {
      const result = formatDateInput(numbers, organisationLocale);
      setInputValue(result.formatted);
      if (result.dateRange) {
        updateDateRange(result.dateRange);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Backspace') {
      setInputValue((prev) => {
        const numbers = prev.replace(/\D/g, '');
        if (numbers.length > 0) {
          return formatDateInput(numbers.slice(0, -1), organisationLocale)
            .formatted;
        }
        return '';
      });

      if (inputValue.replace(/\D/g, '').length <= 1) {
        updateDateRange([null, null]);
      }

      e.preventDefault();
    }
  };

  const clearInput = () => {
    setInputValue('');
  };

  return {
    inputValue,
    handleInputChange,
    handleInputKeyDown,
    clearInput,
  };
}
