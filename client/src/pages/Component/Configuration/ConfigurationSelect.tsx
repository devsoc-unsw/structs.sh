import styles from 'styles/Configuration.module.css';
import { useState } from 'react';
import Select from 'components/Select';
import { SelectItem } from 'components/Select/Select';
import { NativeTypeName, Name } from '../../Types/backendType';

const ConfigurationSelect = ({
  type,
  fields,
  handleUpdateAnnotation,
}: {
  type: string;
  fields: { typeName: NativeTypeName; name: Name }[];
  handleUpdateAnnotation: (type: string, name: string, typeName: string) => void;
}) => {
  const [value, setValue] = useState(fields[0]?.name);

  const handleValueChange = (newValue: string) => {
    const foundField = fields.find((field) => field.name === newValue);
    setValue(newValue);
    handleUpdateAnnotation(type, foundField.name, foundField.typeName);
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
