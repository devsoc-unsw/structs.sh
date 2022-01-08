import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
import React from 'react';

interface Props {
    isTrue: boolean;
    handleChangeIsTrue: (isTrue: boolean) => void;
    correctMessage: string;
    handleChangeCorrectMessage: (correctMessage: string) => void;
    incorrectMessage: string;
    handleChangeIncorrectMessage: (incorrectMessage: string) => void;
    explanation: string;
    handleChangeExplanation: (explanation: string) => void;
}

const TFQuizForm: React.FC<Props> = ({
    isTrue,
    handleChangeIsTrue,
    correctMessage,
    handleChangeCorrectMessage,
    incorrectMessage,
    handleChangeIncorrectMessage,
    explanation,
    handleChangeExplanation,
}) => {
    return (
        <FormControl fullWidth>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isTrue}
                            defaultChecked
                            onChange={(e) => handleChangeIsTrue(Boolean(e.target.checked))}
                        />
                    }
                    label="Is true?"
                />
            </FormGroup>
            <TextField
                sx={{ mt: 2 }}
                label={'Correct Message'}
                placeholder={'That is correct'}
                value={correctMessage}
                multiline
                onChange={(e) => handleChangeCorrectMessage(String(e.target.value))}
            />
            <TextField
                sx={{ mt: 2 }}
                label={'Incorrect Message'}
                placeholder={"That isn't correct because..."}
                value={incorrectMessage}
                multiline
                onChange={(e) => handleChangeIncorrectMessage(String(e.target.value))}
            />
            <TextField
                sx={{ mt: 2 }}
                label={'Explanation'}
                placeholder={'This is because...'}
                value={explanation}
                multiline
                onChange={(e) => handleChangeExplanation(String(e.target.value))}
            />
        </FormControl>
    );
};

export default TFQuizForm;
