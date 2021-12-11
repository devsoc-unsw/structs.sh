import React, { FC, useEffect, useState } from 'react';
import { Alert, Box, Grid, Stack, Typography } from '@mui/material';

import QuestionRenderer from './QuestionRenderer';

import { quiz } from './QuizQuestions';
import { getQuizzes, Quiz } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { LineLoader } from 'components/Loader';

interface Props {
    quizzes: Quiz[];
}

const LessonQuiz: FC<Props> = ({ quizzes }) => {
    const [answered, setAnswered] = useState({});

    return (
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
};

export default LessonQuiz;
