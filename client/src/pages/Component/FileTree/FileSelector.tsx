import Select, { SelectItem } from 'components/Select/Select';
import React from 'react';
import { PLACEHOLDER_PROGRAMS } from '../../../constants';

const FileSelector = ({
  programName,
  onChangeProgramName,
}: {
  programName: string;
  onChangeProgramName: (programName: string) => void;
}) => {
  return (
    <div>
      <div>Select a sample program</div>
      <Select
        value={programName}
        onValueChange={onChangeProgramName}
        placeholder="Select program..."
      >
        {PLACEHOLDER_PROGRAMS.map((program, index: number) => (
          <SelectItem value={program.name} className="" key={index}>
            {program.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default FileSelector;
