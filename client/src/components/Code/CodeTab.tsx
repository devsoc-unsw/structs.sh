import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Theme,
    Typography,
    useTheme,
} from '@mui/material';
import { HorizontalRule } from 'components/HorizontalRule';
import React, { FC, useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
    atomOneDark as darkCodeTheme,
    atomOneLight as lightCodeTheme,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { darkTheme } from 'structsThemes';
import { getSourceCodes, SourceCode, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';

interface Props {
    topic: Topic;
}

const CodeSnippet: FC<Props> = ({ topic }) => {
    const theme: Theme = useTheme();
    const [language, setLanguage] = useState<string>('c');
    const [codeSnippets, setCodeSnippets] = useState<SourceCode[]>();

    useEffect(() => {
        getSourceCodes(topic._id).then(setCodeSnippets).catch(Notification.error);
    }, [topic]);

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="programming-language-selector">Programming Language</InputLabel>
                <Select
                    labelId="programming-language-selector"
                    sx={{
                        background: theme.palette.background.paper,
                    }}
                    id="demo-simple-select"
                    value={language}
                    label="Programming Language"
                    onChange={(e) => setLanguage(String(e.target.value))}
                >
                    <MenuItem value={'c'}>C</MenuItem>
                    <MenuItem value={'csharp'} disabled>
                        C#
                    </MenuItem>
                    <MenuItem value={'java'} disabled>
                        Java
                    </MenuItem>
                    <MenuItem value={'javascript'} disabled>
                        JavaScript
                    </MenuItem>
                    <MenuItem value={'python'} disabled>
                        Python
                    </MenuItem>
                </Select>
            </FormControl>
            <HorizontalRule />
            {codeSnippets &&
                codeSnippets.map((snippet, i) => (
                    <Accordion defaultExpanded={i === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{snippet.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SyntaxHighlighter
                                language="c"
                                style={theme === darkTheme ? darkCodeTheme : lightCodeTheme}
                                showLineNumbers
                                wrapLines={true}
                                lineProps={{
                                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
                                }}
                            >
                                {snippet.code}
                            </SyntaxHighlighter>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </Box>
    );
};

export default CodeSnippet;
