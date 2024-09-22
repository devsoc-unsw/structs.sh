/* eslint-disable */
// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Internal from '@radix-ui/react-select';
import classNames from 'classnames';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from 'styles/Select.module.css';

interface SelectProps extends ComponentPropsWithoutRef<typeof Internal.Root> {
  children: ReactNode;
  triggerClassName: string;
  placeholder: string;
}

const Select = ({ children, triggerClassName = '', placeholder, ...props }: SelectProps) => {
  return (
    <Internal.Root {...props}>
      <Internal.Trigger className={classNames(styles.SelectTrigger, triggerClassName)}>
        <Internal.Value placeholder={placeholder} />
        <Internal.Icon className={styles.SelectIcon}>
          <ChevronDownIcon />
        </Internal.Icon>
      </Internal.Trigger>
      <Internal.Portal>
        <Internal.Content className={styles.SelectContent}>
          <Internal.ScrollUpButton className={styles.SelectScrollButton}>
            <ChevronUpIcon />
          </Internal.ScrollUpButton>
          <Internal.Viewport className={styles.SelectViewPort}>{children}</Internal.Viewport>
          <Internal.ScrollDownButton>
            <ChevronDownIcon />
          </Internal.ScrollDownButton>
        </Internal.Content>
      </Internal.Portal>
    </Internal.Root>
  );
};

interface SelectItemProps {
  value: string;
  className: string;
  children: ReactNode;
}

const SelectItem = ({ value, className, children, ...props }: SelectItemProps) => {
  return (
    <Internal.Item value={value} className={classNames(styles.SelectItem, className)} {...props}>
      <Internal.ItemText>{children}</Internal.ItemText>
      <Internal.ItemIndicator className={styles.SelectItemIndicator}>
        <CheckIcon />
      </Internal.ItemIndicator>
    </Internal.Item>
  );
};

export default Select;
export { SelectItem };
