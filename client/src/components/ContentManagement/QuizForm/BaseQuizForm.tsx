import { FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react';

interface Props {
    question: string;
    handleChangeQuestion: (val: string) => void;
    description: string;
    handleChangeDescription: (val: string) => void;
}

const BaseQuizForm: React.FC<Props> = ({
    question,
    handleChangeQuestion,
    description,
    handleChangeDescription,
}) => {
    return (
        <FormControl fullWidth>
            <TextField
                sx={{ mt: 2 }}
                label={'Question'}
                value={question}
                placeholder="What is the meaning of life?"
                multiline
                onChange={(e) => handleChangeQuestion(String(e.target.value))}
            />
            <TextField
                sx={{ mt: 2 }}
                label={'Description'}
                value={description}
                placeholder="Fourty-two."
                multiline
                onChange={(e) => handleChangeDescription(String(e.target.value))}
            />
        </FormControl>
    );
};

export default BaseQuizForm;
