import { FormControl, TextField } from '@mui/material';
import React from 'react';

interface Props {
    explanation: string;
    handleChangeExplanation: (explanation: string) => void;
}

const QAQuizForm: React.FC<Props> = ({ explanation, handleChangeExplanation }) => {
    return (
        <FormControl fullWidth>
            <TextField
                sx={{ mt: 2 }}
                label="Explanation"
                value={explanation}
                multiline
                onChange={(e) => handleChangeExplanation(String(e.target.value))}
            />
        </FormControl>
    );
};

export default QAQuizForm;
