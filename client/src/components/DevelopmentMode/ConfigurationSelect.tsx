import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import styles from 'styles/Configuration.module.css';

const ConfigurationSelect = () => {
  return (
    <Select.Root>
      <Select.Trigger className={styles.SelectTrigger}>
        <Select.Value placeholder="Select annotation..." />
        <Select.Icon className={styles.SelectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.SelectContent}>
          <Select.ScrollUpButton className={styles.SelectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.SelectViewPort}>
            <Select.Item value="Data" className={styles.SelectItem}>
              <Select.ItemText>Data</Select.ItemText>
              <Select.ItemIndicator className={styles.SelectItemIndicator}>
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="Next" className={styles.SelectItem}>
              <Select.ItemText>Next Node</Select.ItemText>
              <Select.ItemIndicator className={styles.SelectItemIndicator}>
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default ConfigurationSelect;
