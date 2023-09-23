import styles from 'styles/Configuration.module.css';
import { useState } from 'react';
import Select from 'components/Select';
import { SelectItem } from 'components/Select/Select';

const ConfigurationSelect = ({ type, fields, handleUpdateAnnotation }) => {
  const [value, setValue] = useState('');

  const handleValueChange = (newValue: string) => {
    const field = fields.find((field) => field.name === newValue);
    setValue(newValue);
    handleUpdateAnnotation(type, field.name, field.type);
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      placeholder="Select annotation..."
      triggerClassName={styles.monospaceFont}
    >
      {fields.map((field, index: number) => (
        <SelectItem className={styles.monospaceFont} value={field.name} key={index}>
          {field.type} {field.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ConfigurationSelect;
