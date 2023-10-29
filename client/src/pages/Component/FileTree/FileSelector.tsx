import Select, { SelectItem } from 'components/Select/Select';
import { useState } from 'react';

const FileSelector = ({
  onChangeProgramName,
  files,
}: {
  onChangeProgramName: (programName: string) => void;
  files: {
    name: string;
    text: string;
  }[]
}) => {

  // const [formData, setFormData] = useState({
  //   filename: '',
  // });

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  // const handleSubmit = (event) => {
    // event.preventDefault();

    // if (formData.filename == '' || (files.some(file => file.name == formData.filename))) {
    //   return;
    // }

    // // setFiles([
    // //   ...files,
    // //   { name: formData.filename, text: ''}
    // // ]);


    // const data = {
    //   username: 'benp123',
    //   filename: programName,
    //   fileData: ''
    // };

    // axios.post(SERVER_URL + '/api/saveFile', data).then((respsonse) => {
    // });
  // };

  // const [showForm, setShowForm] = useState(false);
  // const [newOption, setNewOption] = useState('');
  // const [options, setOptions] = useState(['Option 1', 'Option 2']);

  // const handleAddOption = () => {
  //   // Update your options state with the new option
  //   setOptions([...options, newOption]);

  //   // Clear the form and hide it
  //   setNewOption('');
  //   setShowForm(false);
  // };

  return (
      <div style={{paddingTop: '10px'}}>
        <Select
          onValueChange={onChangeProgramName}
          placeholder="Select File..."
        >
          {files.map((file, index: number) => (
            <SelectItem style={{ fontSize: '13px' }} value={file.name} className="" key={index}>
              {file.name}
            </SelectItem>
          ))}
        </Select>
      </div>
  );
};

export default FileSelector;
