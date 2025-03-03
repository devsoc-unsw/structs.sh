import styles from 'styles/Configuration.module.css';
import { useState } from 'react';
import Select from 'components/Select';
import { SelectItem } from 'components/Select/Select';
import { NativeTypeName, Name } from '../../Types/backendType';

const ConfigurationSelect = ({
  fields,
  handleUpdateAnnotation,
}: {
  fields: { typeName: NativeTypeName; name: Name }[];
  handleUpdateAnnotation: (name: string, typeName: string) => void;
}) => {
  const [value, setValue] = useState(fields[0]?.name);

  const handleValueChange = (newValue: string) => {
    const foundField = fields.find((field) => field.name === newValue);
    if (!foundField) {
      console.error('Field not found');
      return;
    }
    setValue(newValue);
    handleUpdateAnnotation(foundField.name, foundField.typeName);
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
          {field.typeName} {field.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ConfigurationSelect;
