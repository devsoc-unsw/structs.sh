import { FC } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COURSE_CODES } from '@/constants/ui'

interface Props {
  addValue: (newValue: string) => void;
  courses: string[];
}

interface Option {
  label: string;
}

const options: Option[] = COURSE_CODES.map((code) => ({ label: code }));

const CoursesSelector: FC<Props> = ({ addValue, courses }) => {
  const optionsWithoutDuplicates = options.filter((option) => !courses.includes(option.label));
  const optionExistsInChoices = (e: any) =>
    options.some((option) => option.label === String(e.target.value));
  const optionNotSelectedYet = (e: any) => !courses.includes(String(e.target.value));

  return (
    <Autocomplete
      disablePortal
      id="topic-courses"
      options={optionsWithoutDuplicates}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Course"
          color="info"
          onKeyDown={(e: any) => {
            if (e.keyCode === 13 && optionExistsInChoices(e) && optionNotSelectedYet(e)) {
              addValue(String(e.target.value));
            }
          }}
        />
      )}
    />
  );
};

export default CoursesSelector;
