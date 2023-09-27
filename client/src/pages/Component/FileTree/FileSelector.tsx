import Select, { SelectItem } from 'components/Select/Select';
import React, { useState } from 'react';
import { PLACEHOLDER_PROGRAMS } from '../../../constants';
import axios from 'axios';
import { SERVER_URL } from 'utils/constants';

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

  return (
    <div>
      <div>Select a sample program</div>
      <Select
        value={programName}
        onValueChange={onChangeProgramName}
        placeholder="Select program..."
      >
        {files.map((program, index: number) => (
          <SelectItem value={program.name} className="" key={index}>
            {program.name}
          </SelectItem>
        ))}
      </Select>
      <br></br>
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="Create New File:" >Create New File:</label>
        <input
          style={{backgroundColor: '#cfcfcf', borderRadius: 4, padding: 4}}
          id="filename"
          name='filename'
          value={formData.filename}
          onChange={handleInputChange}
          placeholder='enter file name here'
        />
      </div>
      <div>
        <button
          style={{
            backgroundColor: '#cfcfcf',
            borderRadius: 4,
            marginTop: 10,
            padding: 4,
          }}
          type="submit">Create
        </button>
      </div>
    </form>
    </div>
  );
};

export default FileSelector;
