import BulletIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Checkbox,
  FormControl,
  List,
  ListItem,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import Notification from 'utils/Notification';

interface Props {
  choices: string[];
  handleChangeChoices: (choices: string[]) => void;
  answers: boolean[];
  handleChangeAnswers: (answers: boolean[]) => void;
  maxSelections: number;
  handleChangeMaxSelections: (maxSelections: number) => void;
  correctMessage: string;
  handleChangeCorrectMessage: (correctMessage: string) => void;
  incorrectMessage: string;
  handleChangeIncorrectMessage: (incorrectMessage: string) => void;
  explanation: string;
  handleChangeExplanation: (explanation: string) => void;
}

const MCQuizForm: React.FC<Props> = ({
  choices,
  handleChangeChoices,
  answers,
  handleChangeAnswers,
  maxSelections,
  handleChangeMaxSelections,
  correctMessage,
  handleChangeCorrectMessage,
  incorrectMessage,
  handleChangeIncorrectMessage,
  explanation,
  handleChangeExplanation,
}) => (
  <FormControl fullWidth>
    <Typography color="textPrimary" sx={{ mt: 2 }}>
      Press Enter to add a new choice
    </Typography>
    <TextField
      label="Add a Choice"
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          Notification.info('Adding');
          handleChangeChoices([...choices, String(e.target.value)]);
          handleChangeAnswers([...answers, false]);
          e.target.value = '';
        }
      }}
    />
    <List>
      {choices
      && choices.map((choice, idx) => (
        <ListItem
          key={idx}
          secondaryAction={(
            <>
              <Typography color="textSecondary" display="inline">
                Correct?
              </Typography>
              {' '}
              <Checkbox
                edge="end"
                checked={answers[idx]}
                defaultChecked={answers[idx]}
                onChange={(e) => {
                  const newAnswers = answers.map((answer, j) => {
                    if (idx === j) {
                      return Boolean(e.target.checked);
                    }
                    return answer;
                  });
                  handleChangeAnswers(newAnswers);
                }}
              />
            </>
                )}
        >
          <ListItemIcon>
            <BulletIcon color="info" />
          </ListItemIcon>
          &quot;
          {choice}
          &quot;
        </ListItem>
      ))}
    </List>
    {/* <Typography color="textSecondary" sx={{ mb: 4 }}>
                Answers: {answers && answers.length > 0 ? answers.join(', ') : 'None'}
            </Typography> */}
    <TextField
      label="Max Selections"
      type="number"
      value={maxSelections}
      onChange={(e) => handleChangeMaxSelections(Number(e.target.value))}
    />
    <TextField
      sx={{ mt: 2 }}
      label="Correct Message"
      placeholder="That is correct"
      value={correctMessage}
      multiline
      onChange={(e) => handleChangeCorrectMessage(String(e.target.value))}
    />
    <TextField
      sx={{ mt: 2 }}
      label="Incorrect Message"
      placeholder={"That isn't correct because..."}
      value={incorrectMessage}
      multiline
      onChange={(e) => handleChangeIncorrectMessage(String(e.target.value))}
    />
    <TextField
      sx={{ mt: 2 }}
      label="Explanation"
      placeholder="This is because..."
      value={explanation}
      multiline
      onChange={(e) => handleChangeExplanation(String(e.target.value))}
    />
  </FormControl>
);

export default MCQuizForm;
