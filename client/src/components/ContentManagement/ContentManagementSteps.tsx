import React, { FC, useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
    getLessons,
    Lesson,
    getTopics,
    Topic,
    getQuizzes,
    Quiz,
    getSourceCodes,
    SourceCode,
    createLesson,
    createQuiz,
    createTopic,
    createSourceCode,
} from 'utils/apiRequests';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Container,
    Grid,
    List,
    ListItem,
    TextField,
} from '@mui/material';
import { Notification } from 'utils/Notification';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { TagSelector } from 'components/Tags';
import { CoursesSelector } from 'components/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import VideoIcon from '@mui/icons-material/Videocam';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {}

type TopicForm = Omit<Topic, '_id'>;

const emptyTopicForm: TopicForm = {
    title: '',
    description: '',
    image: '',
    courses: [],
    videos: [],
    sourceCodeIds: [],
};

const ContentManagementSteps: FC<Props> = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [topicFormValues, setTopicFormValues] = useState<TopicForm>(emptyTopicForm);

    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLessonId, setLessonId] = useState<string>('');
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const [markdownValue, setMarkdownValue] = useState<string>('');

    const userId = '612f3f9fe0a7433f52c3d815'; // TODO: this is set to an admin user manually added to MongoDB. If that user is deleted, then this will break

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
    }, []);

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
        },
        [topics]
    );

    const deselectTopic = useCallback(() => {
        setSelectedTopicId('');
        setTopicFormValues(emptyTopicForm);
    }, []);

    // TODO: Remove this. It's just for debugging
    useEffect(() => {
        console.log(topicFormValues);
    }, [topicFormValues]);

    /* ----------------------------- Form Callbacks ----------------------------- */

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
                        <Typography>
                            Select a topic or data structure that you want to make new lessons for,
                            or whose lessons you wish to modify or delete. To create a new topic
                            entirely, don't select any of the topics below and click 'continue'
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
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
                                                sx={{
                                                    background:
                                                        selectedTopicId === topic._id && 'yellow',
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
                        </Box>
                    </StepContent>
                </Step>
                {/* Step 2 */}
                <Step>
                    <StepLabel>
                        <Typography variant="body1" color="textSecondary">
                            (Optional) Manage Topic
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <Typography>Manage the topic and its videos and code.</Typography>
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
                                                    <a href={videoUrl}>{videoUrl}</a>
                                                </ListItem>
                                            ))}
                                    </List>
                                </Box>

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
                                                    <Typography>{sourceCode.title}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <pre>{sourceCode.code}</pre>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                </Box>

                                <br />
                                <Typography>
                                    ⚠️ You must click 'Submit' to create a new topic or save changes
                                    before progressing!
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 1, mr: 1, mb: 6 }}
                                >
                                    Submit
                                </Button>
                            </Box>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    endIcon={<ArrowDownwardIcon />}
                                >
                                    Skip
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
                        <Typography>
                            Select one of the existing lessons or create a new one.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                                {lessons &&
                                    lessons.map((lesson) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Card sx={{ maxWidth: 345 }}>
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
                        <Typography>Modify the lesson content and its quizzes.</Typography>
                        <Box sx={{ mb: 2 }}>
                            <div>CONTENT HERE</div>
                            <div>
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
            </Stepper>
        </Box>
    );
};

export default ContentManagementSteps;
