import { Alert, Box, Stack } from '@mui/material';
import { LineLoader } from 'components/Loader';
import React, { FC } from 'react';
import { Quiz } from 'utils/apiRequests';
import QuestionRenderer from './QuestionRenderer';

interface Props {
  quizzes: Quiz[];
}

const LessonQuiz: FC<Props> = ({ quizzes }) => (
  <Box className="spacing">
    {quizzes ? (
      quizzes.length > 0 ? (
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          {quizzes.map((quiz, i) => (
            <Box key={quiz._id}>
              <QuestionRenderer quiz={quiz} questionNumber={Number(i + 1)} />
            </Box>
          ))}
        </Stack>
      ) : (
        <Alert severity="info">This lesson has no quizzes.</Alert>
      )
    ) : (
      <LineLoader />
    )}
  </Box>
);

export default LessonQuiz;
