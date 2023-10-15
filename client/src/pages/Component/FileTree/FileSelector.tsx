import Select, { SelectItem } from 'components/Select/Select';
import React, { useState } from 'react';
import { PLACEHOLDER_PROGRAMS } from '../../../constants';
import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import styled from '@emotion/styled';
import WorkspaceForm from './WorkspaceForm';

const FileSelector = ({
  programName,
  onChangeProgramName,
}: {
  programName: string;
  onChangeProgramName: (programName: string) => void;
}) => {

  const [formData, setFormData] = useState({
    filename: '',
  });

  const [files, setFiles] = useState(PLACEHOLDER_PROGRAMS);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.filename == '' || (files.some(file => file.name == formData.filename))) {
      return;
    }

    setFiles([
      ...files,
      { name: formData.filename, text: ''}
    ]);


    const data = {
      username: 'benp123',
      filename: programName,
      fileData: ''
    };

    axios.post(SERVER_URL + '/api/saveFile', data).then((respsonse) => {
    });
  };

  const WorkSpaceMenu = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: 'center';
  `

  const [showForm, setShowForm] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [options, setOptions] = useState(['Option 1', 'Option 2']);

  const handleAddOption = () => {
    // Update your options state with the new option
    setOptions([...options, newOption]);

    // Clear the form and hide it
    setNewOption('');
    setShowForm(false);
  };

  const customControlStyles = base => ({
    height: 200,
    minHeight: 200
});

  return (
    <div>
      <div>Select Workspace</div>
        <WorkspaceForm/>
        <div style={{width: '195px', minWidth: '195px', height: '20px', minHeight: '20px'}}>
        <Select
          styles={{control: customControlStyles}}
          value={programName}
          onValueChange={onChangeProgramName}
          placeholder="Select Workspace..."
        >
          {files.map((program, index: number) => (
            <SelectItem style={{ fontSize: '13px' }} value={program.name} className="" key={index}>
              {program.name}
            </SelectItem>
          ))}
        </Select>
        </div>
    </div>
  );
};

export default FileSelector;
