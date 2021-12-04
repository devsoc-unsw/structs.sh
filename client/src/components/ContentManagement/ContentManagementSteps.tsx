import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoIcon from '@mui/icons-material/Videocam';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    FormControl,
    Grid,
    InputLabel,
    Link,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { CoursesSelector } from 'components/Autocomplete';
import { MarkdownEditor } from 'components/MarkdownEditor';
import { TagSelector } from 'components/Tags';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    createLesson,
    createSourceCode,
    createTopic,
    editLesson,
    editTopic,
    getLessons,
    getQuizzes,
    getSourceCodes,
    getTopics,
    Lesson,
    LessonForm,
    Quiz,
    QuizForm,
    SourceCode,
    SourceCodeForm,
    Topic,
    TopicForm,
} from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import styles from './ContentManagement.module.scss';

interface Props {}

const emptyTopicForm: TopicForm = {
    title: '',
    description: '',
    image: '',
    courses: [],
    videos: [],
    sourceCodeIds: [],
};

const emptySourceCodeForm: SourceCodeForm = {
    topicId: '',
    title: '',
    code: '',
};

const emptyLessonForm: LessonForm = {
    topicId: '',
    title: '',
    rawMarkdown: '',
    creatorId: '612f3f9fe0a7433f52c3d815', // TODO: this is set to an admin user manually added to MongoDB. If that user is deleted, then this will break
    quizzes: [],
};

const emptyQuizForm: QuizForm = {
    type: '',
    data: '',
};

const ContentManagementSteps: FC<Props> = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [topicFormValues, setTopicFormValues] = useState<TopicForm>(emptyTopicForm);

    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
    const [sourceCodeFormValues, setSourceCodeFormValues] = useState<SourceCodeForm>(
        emptySourceCodeForm
    );

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');
    const [lessonFormValues, setLessonFormValues] = useState<LessonForm>(emptyLessonForm);

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<string>('');
    const [quizFormValues, setQuizFormValues] = useState<QuizForm>(emptyQuizForm);

    /* ------------------------------ Data Fetching ----------------------------- */

    const fetchTopics = useCallback(() => {
        getTopics()
            .then((topics: Topic[]) => {
                setTopics(topics);
            })
            .catch((errMessage) => {
                Notification.error(`Failed to load topics. Reason: ${errMessage}`);
            });
    }, [setTopics]);

    const fetchLessons = useCallback(
        (topicId: string) => {
            getLessons(topicId)
                .then((lessons: Lesson[]) => {
                    setLessons(lessons);
                })
                .catch((errMessage) => {
                    Notification.error(`Failed to load lessons. Reason: ${errMessage}`);
                });
        },
        [setLessons]
    );

    const fetchQuizzes = useCallback(
        (lessonId: string) => {
            getQuizzes(lessonId)
                .then((quizzes: Quiz[]) => {
                    setQuizzes(quizzes);
                })
                .catch((errMessage) => {
                    Notification.error(`Failed to load quizzes. Reason: ${errMessage}`);
                });
        },
        [setQuizzes]
    );

    const fetchTopicSourceCode = useCallback(
        (topicId: string) => {
            getSourceCodes(topicId)
                .then((sourceCode: SourceCode[]) => setSourceCodes(sourceCode))
                .catch((errMessage) =>
                    Notification.error(`Failed to load source code. Reason: ${errMessage}`)
                );
        },
        [setSourceCodes]
    );

    // Initially fetch all topics
    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    // When a topic is selected, then all its source code and child lessons should be fetched
    useEffect(() => {
        if (selectedTopicId) {
            fetchLessons(selectedTopicId);
            fetchTopicSourceCode(selectedTopicId);
        }
    }, [selectedTopicId]);

    // When a lesson is selected then all its child quizzes should be fetched
    useEffect(() => {
        if (selectedLessonId) {
            fetchQuizzes(selectedLessonId);
        }
    }, [selectedLessonId]);

    /* --------------------------- Selection Callbacks -------------------------- */

    const selectTopic = useCallback(
        (topicId: string) => {
            const selectedTopic: Topic = topics.find((topic) => topic._id === topicId);
            if (!selectedTopic) {
                return;
            }
            setSelectedTopicId(topicId);
            setTopicFormValues(selectedTopic);
            setSourceCodeFormValues({ ...sourceCodeFormValues, topicId: topicId });
            setLessonFormValues({ ...lessonFormValues, topicId: topicId });
            setActiveStep(1);
        },
        [topics, sourceCodeFormValues, lessonFormValues]
    );

    const deselectTopic = useCallback(() => {
        deselectLesson();
        setSelectedTopicId('');
        setTopicFormValues(emptyTopicForm);
        setLessonFormValues(emptyLessonForm);
        setSourceCodes([]);
    }, []);

    const selectLesson = useCallback(
        (lessonId: string) => {
            const selectedLesson: Lesson = lessons.find((lesson) => lesson._id === lessonId);
            if (!selectedLesson) {
                return;
            }
            setSelectedLessonId(lessonId);
            setLessonFormValues(selectedLesson);
            setActiveStep(3);
        },
        [lessons]
    );

    const deselectLesson = useCallback(() => {
        setSelectedLessonId('');
        setLessonFormValues({
            ...emptyLessonForm,
            topicId: lessonFormValues.topicId,
            creatorId: lessonFormValues.creatorId,
        });
    }, [lessonFormValues]);

    const selectQuiz = useCallback((quizId: string) => {
        const selectedQuiz: Quiz = quizzes.find((quiz) => quiz._id === quizId);
        if (!selectedQuiz) {
            return;
        }
        setSelectedQuizId(quizId);
        setQuizFormValues(selectedQuiz);
    }, []);

    const deselectQuiz = useCallback(() => {
        setSelectedQuizId('');
        setQuizFormValues(emptyQuizForm);
    }, []);

    // TODO: Remove this. It's just for debugging
    useEffect(() => {
        console.log(topicFormValues);
    }, [topicFormValues]);

    /* ----------------------------- Form Callbacks ----------------------------- */

    const handleCreateCodeSnippet = useCallback(() => {
        createSourceCode(sourceCodeFormValues)
            .then((sourceCode) => {
                Notification.success('Created new source code snippet');
                setSourceCodes([...sourceCodes, sourceCode]);
            })
            .catch((errMessage) => {
                Notification.error(errMessage);
            });
    }, [sourceCodeFormValues, sourceCodes]);

    const handleCreateTopic = useCallback(() => {
        createTopic(topicFormValues)
            .then((topic) => {
                Notification.success('Created new topic');
                setTopics([...topics, topic]);
                setSelectedTopicId(topic._id);
            })
            .catch((errMessage) => {
                console.log(errMessage);
                Notification.error(errMessage);
            });
    }, [topicFormValues, topics]);

    const handleUpdateTopic = useCallback(() => {
        editTopic(selectedTopicId, topicFormValues)
            .then((newTopic) => {
                Notification.success('Updated topic');
                setTopicFormValues(newTopic);
                const topicIndex: number = topics.findIndex(
                    (topic) => topic._id === selectedTopicId
                );
                if (topicIndex === -1) throw Error('Topics data inconsistent. Please report');
                // Replace the old topic with the new one in the `topics` array to ensure that changes are reflected in the UI
                setTopics(
                    topics.map((topic, i) => {
                        if (topic._id === selectedTopicId) {
                            return newTopic;
                        }
                        return topic;
                    })
                );
            })
            .catch(Notification.error);
    }, [topicFormValues, selectedTopicId, topics]);

    const handleCreateLesson = useCallback(() => {
        createLesson(lessonFormValues)
            .then((lesson) => {
                Notification.success('Created new lesson');
                setLessons([...lessons, lesson]);
                setSelectedLessonId(lesson._id);
            })
            .catch(Notification.error);
    }, [lessonFormValues, lessons]);

    const handleUpdateLesson = useCallback(() => {
        editLesson(selectedLessonId, lessonFormValues)
            .then((newLesson) => {
                Notification.success('Updated lesson');
                setLessonFormValues(newLesson);
                const lessonIndex: number = lessons.findIndex(
                    (lesson) => lesson._id === selectedLessonId
                );
                if (lessonIndex === -1) throw Error('Lessons data inconsistent. Please report');
                setLessons(
                    lessons.map((lesson, i) => {
                        if (lesson._id === selectedLessonId) {
                            return newLesson;
                        }
                        return lesson;
                    })
                );
            })
            .catch(Notification.error);
    }, [lessonFormValues, lessons]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box sx={{ textAlign: 'left' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {/* Step 1 */}
                <Step>
                    <StepLabel>
                        <Typography variant="body1" color="textPrimary">
                            Select topic or data structure
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Typography color="textPrimary">
                            Select a topic or data structure that you want to make new lessons for,
                            or whose lessons you wish to modify or delete. To create a new topic
                            entirely, don't select any of the topics below and click 'continue'
                        </Typography>
                        <Box sx={{ margin: 4 }}>
                            <Grid container spacing={5}>
                                {topics &&
                                    topics.length > 0 &&
                                    topics.map((topic) => (
                                        <Grid item>
                                            <Card
                                                onClick={() => {
                                                    selectedTopicId !== topic._id
                                                        ? selectTopic(topic._id)
                                                        : deselectTopic();
                                                }}
                                                className={styles.card}
                                                sx={{
                                                    background:
                                                        selectedTopicId === topic._id &&
                                                        'greenyellow',
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={
                                                        topic.image ||
                                                        'https://via.placeholder.com/150'
                                                    }
                                                    alt={topic.title}
                                                />
                                                <CardContent>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="div"
                                                    >
                                                        {topic.title}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {topic.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                        <div>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                                endIcon={<ArrowDownwardIcon />}
                            >
                                Continue
                            </Button>
                        </div>
                    </StepContent>
                </Step>
                {/* Step 2 */}
                <Step>
                    <StepLabel>
                        <Typography variant="body1" color="textPrimary">
                            Manage Topic
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Typography color="textPrimary">
                            Manage the topic and its videos and code.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ mt: 2 }}>
                                {/* Title */}
                                <TextField
                                    required
                                    sx={{ width: '100%', mb: 2 }}
                                    id="topic-title"
                                    label="Title"
                                    placeholder="Eg. Linked Lists"
                                    value={topicFormValues.title}
                                    onChange={(e) => {
                                        setTopicFormValues({
                                            ...topicFormValues,
                                            title: String(e.target.value),
                                        });
                                    }}
                                />
                                {/* Description */}
                                <TextField
                                    required
                                    sx={{ width: '100%', mb: 2 }}
                                    id="topic-description"
                                    label="Description"
                                    placeholder="Eg. A linear collection of elements"
                                    value={topicFormValues.description}
                                    onChange={(e) => {
                                        setTopicFormValues({
                                            ...topicFormValues,
                                            description: String(e.target.value),
                                        });
                                    }}
                                />
                                {/* Image URL */}
                                <TextField
                                    required
                                    sx={{ width: '100%', mb: 2 }}
                                    id="topic-image"
                                    label="Image URL"
                                    placeholder="URL"
                                    value={topicFormValues.image}
                                    onChange={(e) => {
                                        setTopicFormValues({
                                            ...topicFormValues,
                                            image: String(e.target.value),
                                        });
                                    }}
                                />
                                {/* Courses */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography color="textPrimary" variant="h6">
                                        UNSW courses that this topic belongs to:
                                    </Typography>
                                    <CoursesSelector
                                        courses={topicFormValues.courses}
                                        addValue={(newValue: string) =>
                                            setTopicFormValues({
                                                ...topicFormValues,
                                                courses: [...topicFormValues.courses, newValue],
                                            })
                                        }
                                    />
                                    <TagSelector
                                        selectedTags={topicFormValues.courses}
                                        setSelectedTags={(tags) =>
                                            setTopicFormValues({
                                                ...topicFormValues,
                                                courses: tags,
                                            })
                                        }
                                    />
                                </Box>
                                {/* Videos */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography color="textPrimary" variant="h6">
                                        List of videos related to this topic:
                                    </Typography>
                                    <List>
                                        {topicFormValues.videos &&
                                            topicFormValues.videos.map((videoUrl) => (
                                                <ListItem
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            color="error"
                                                            onClick={() =>
                                                                Notification.info(
                                                                    'Not implemented yet'
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <VideoIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <Link href={videoUrl} color={'textPrimary'}>
                                                        {videoUrl}
                                                    </Link>
                                                </ListItem>
                                            ))}
                                        <Typography color="textPrimary">
                                            Press Enter to add video URL
                                        </Typography>
                                        <TextField
                                            label="Video URL"
                                            placeholder="Eg. https://youtube.com/..."
                                            onKeyDown={(e: any) => {
                                                if (e.keyCode === 13) {
                                                    setTopicFormValues({
                                                        ...topicFormValues,
                                                        videos: [
                                                            ...topicFormValues.videos,
                                                            String(e.target.value),
                                                        ],
                                                    });
                                                }
                                            }}
                                        />
                                    </List>
                                </Box>

                                <br />

                                {selectedTopicId ? (
                                    <>
                                        <Typography color="textPrimary">
                                            ⚠️ You must click 'Submit' to create a new topic or save
                                            changes before progressing!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ mt: 1, mr: 1, mb: 6 }}
                                            onClick={() => handleUpdateTopic()}
                                        >
                                            Submit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography color="textPrimary">
                                            ⚠️ You must click 'Create' to create a new topic or save
                                            changes before progressing!
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ mt: 1, mr: 1, mb: 6 }}
                                            onClick={() => handleCreateTopic()}
                                        >
                                            Create
                                        </Button>
                                    </>
                                )}

                                {/* Source Code */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography color="textPrimary" variant="h6">
                                        Topic-related source code to display to students:
                                    </Typography>
                                    {sourceCodes &&
                                        sourceCodes.map((sourceCode) => (
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography color="textPrimary">
                                                        {sourceCode.title}
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <pre>{sourceCode.code}</pre>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    <Typography color="textPrimary">Add new snippet</Typography>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <TextField
                                            id="topic-source-code-title"
                                            label="Title"
                                            placeholder="Eg. Insertion Algorithm"
                                            onChange={(e) =>
                                                setSourceCodeFormValues({
                                                    ...sourceCodeFormValues,
                                                    title: String(e.target.value),
                                                })
                                            }
                                        />
                                        <TextField
                                            id="topic-source-code-code"
                                            label="Source Code"
                                            placeholder="Placeholder"
                                            multiline
                                            variant="standard"
                                            onChange={(e) =>
                                                setSourceCodeFormValues({
                                                    ...sourceCodeFormValues,
                                                    code: String(e.target.value),
                                                })
                                            }
                                            sx={{ width: '100%' }}
                                        />
                                        <br />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCreateCodeSnippet}
                                        >
                                            Submit Code
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    endIcon={<ArrowDownwardIcon />}
                                >
                                    Continue
                                </Button>
                                <Button
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                    variant="outlined"
                                    endIcon={<ArrowUpwardIcon />}
                                >
                                    Back
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                {/* Step 3 */}
                <Step>
                    <StepLabel>
                        <Typography variant="body1" color="textPrimary">
                            Select a lesson
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Typography color="textPrimary">
                            Select one of the existing lessons or create a new one. Continue with no
                            selection to create a new lesson.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                                {lessons &&
                                    lessons.map((lesson) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Card
                                                onClick={() => {
                                                    selectedLessonId !== lesson._id
                                                        ? selectLesson(lesson._id)
                                                        : deselectLesson();
                                                }}
                                                sx={{
                                                    background:
                                                        selectedLessonId === lesson._id && 'yellow',
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image="https://miro.medium.com/max/1200/1*KpDOKMFAgDWaGTQHL0r70g.png"
                                                    alt="green iguana"
                                                />
                                                <CardContent>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="div"
                                                    >
                                                        {lesson.title}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                            </Grid>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    endIcon={<ArrowDownwardIcon />}
                                >
                                    Continue
                                </Button>
                                <Button
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                    endIcon={<ArrowUpwardIcon />}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                {/* Step 4 */}
                <Step>
                    <StepLabel>
                        <Typography variant="body1" color="textPrimary">
                            Manage lesson
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Typography color="textPrimary">
                            Modify or create lesson content and its quizzes.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box>
                                <TextField
                                    sx={{ width: '100%' }}
                                    label={'Title'}
                                    id="lesson-title"
                                    required
                                    value={lessonFormValues.title}
                                    onChange={(e) =>
                                        setLessonFormValues({
                                            ...lessonFormValues,
                                            title: String(e.target.value),
                                        })
                                    }
                                />
                                <MarkdownEditor
                                    markdownValue={lessonFormValues.rawMarkdown}
                                    setMarkdownValue={(newMarkdown: string) =>
                                        setLessonFormValues({
                                            ...lessonFormValues,
                                            rawMarkdown: newMarkdown,
                                        })
                                    }
                                    readOnly={false}
                                />
                                <Typography color="textPrimary">
                                    ⚠️ You must click 'Create' to create a new topic or 'Update' to
                                    save changes before progressing!
                                </Typography>
                                <Button
                                    color="secondary"
                                    onClick={() =>
                                        selectedLessonId
                                            ? handleUpdateLesson()
                                            : handleCreateLesson()
                                    }
                                    variant="contained"
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {selectedLessonId ? 'Update' : 'Create'}
                                </Button>
                            </Box>
                            <br />
                            <Box>
                                <Typography variant="h5" color="textPrimary">
                                    Manage Quizzes
                                </Typography>
                                {quizzes ? (
                                    quizzes.map((quiz) => (
                                        <Grid item>
                                            <Card
                                                onClick={() => {
                                                    selectedQuizId !== quiz._id
                                                        ? selectQuiz(quiz._id)
                                                        : deselectQuiz();
                                                }}
                                                sx={{
                                                    background:
                                                        selectedQuizId === quiz._id && 'yellow',
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="div"
                                                    >
                                                        {quiz.type}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {quiz.data}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography variant="body1" color="textPrimary">
                                        This lesson currently has no associated quizzes. Use the
                                        form below to create one:
                                    </Typography>
                                )}
                                {/* Quiz Builder */}
                                {/* <Box sx={{ mt: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="quiz-question-type">
                                            Question Type
                                        </InputLabel>
                                        <Select
                                            labelId="quiz-question-type"
                                            label="Question Type"
                                            value={quizFormValues.questionType}
                                            onChange={(e) =>
                                                setQuizFormValues({
                                                    ...quizFormValues,
                                                    questionType: String(e.target.value),
                                                })
                                            }
                                        >
                                            <MenuItem value={'mc'}>Multiple Choice</MenuItem>
                                            <MenuItem value={'tf'}>True/False</MenuItem>
                                            <MenuItem value={'qa'}>Question-Answer</MenuItem>
                                        </Select>
                                        <TextField
                                            sx={{ mt: 2 }}
                                            id="quiz-question"
                                            label={'Question'}
                                            value={quizFormValues.question}
                                            placeholder="What is the meaning of life?"
                                            multiline
                                            onChange={(e) =>
                                                setQuizFormValues({
                                                    ...quizFormValues,
                                                    question: String(e.target.value),
                                                })
                                            }
                                        />
                                    </FormControl>
                                </Box> */}
                            </Box>
                            <br />
                            <div>
                                <Button
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                    variant="contained"
                                    endIcon={<ArrowUpwardIcon />}
                                >
                                    Back
                                </Button>
                            </div>
                            <pre>{JSON.stringify(quizFormValues, null, 4)}</pre>
                            {/* <pre>{JSON.stringify(lessonFormValues, null, 4)}</pre> */}
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>
        </Box>
    );
};

export default ContentManagementSteps;
