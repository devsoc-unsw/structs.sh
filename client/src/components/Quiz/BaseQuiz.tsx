import React, { ReactNode } from 'react';
import Card from '@mui/material/Card';
import { Box, Theme, Typography, useTheme } from '@mui/material';
import { Quiz } from 'utils/apiRequests';
import { MarkdownEditor } from 'components/MarkdownEditor';
import { HorizontalRule } from 'components/HorizontalRule';

interface Props {
    quiz: Quiz;
    questionNumber?: number;
    children: ReactNode;
}

const BaseQuiz: React.FC<Props> = ({ quiz, questionNumber, children }) => {
    const theme: Theme = useTheme();

    return (
        <Card elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">
                {questionNumber && <strong>{questionNumber}. </strong>}
                {quiz.question}
            </Typography>
            <Box sx={{ pl: 2, pr: 2, pt: 2 }}>
                <MarkdownEditor
                    markdownValue={quiz.description}
                    themeOverride={{ background: theme.palette.background.paper }}
                    readOnly
                />
            </Box>
            <HorizontalRule />
            {children}
        </Card>
    );
};

export default BaseQuiz;
