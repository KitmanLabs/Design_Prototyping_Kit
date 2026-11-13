import { useState, useRef, useEffect, cloneElement, } from 'react';

import { Box, Button } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

// TODO: Add MUI styles when use case requires them, currently only use case uses
// kitmanDesignSystem.
import getStyles from './styles';


// DummySelect component behaves exactly like a traditional Select component, but is to be used when
// element doesn't have traditional "options". Component will render a label, a value in the Select
// and a menu that can render any children.
const DummySelect = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const styles = getStyles(isOpen);

  const menuRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    // Pragmatically focus on menu div to allow blur functionality to work
    if (isOpen === true) {
      menuRef.current?.focus();
    }
  }, [isOpen]);

  const handleBlur = (e) => {
    // Close menu if focused element is NOT parent or child element, or select button
    if (
      e.relatedTarget !== selectRef.current &&
      !e.currentTarget.contains(e.relatedTarget)
    ) {
      setIsOpen(false);
    }
  };

  return (
    <Box css={styles.dummySelect} title={props.title}>
      {props.label && <label css={styles.label}>{props.label}</label>}

      <Box css={styles.buttonContainer}>
        <Button
          css={styles.button}
          variant="text"
          ref={selectRef}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Box>{props.option.label}</Box>
          <KitmanIcon
            name={
              isOpen
                ? KITMAN_ICON_NAMES.KeyboardArrowUpIcon
                : KITMAN_ICON_NAMES.KeyboardArrowDownIcon
            }
            css={styles.icon}
          />
        </Button>
      </Box>

      {isOpen && (
        <Box css={styles.menu} tabIndex="-1" ref={menuRef} onBlur={handleBlur}>
                    {cloneElement(props.children, {
            option: props.option,
            onChange: (value) => {
              setIsOpen(false);
              props.onChange(value);
            },
          })}
        </Box>
      )}
    </Box>
  );
};

export default DummySelect;
