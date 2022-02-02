import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoIcon from '@mui/icons-material/Videocam';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  NativeSelect,
  Pagination,
  Paper,
  TextField,
  Theme,
  useTheme,
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
import { HorizontalRule } from 'components/HorizontalRule';
import { MarkdownEditor } from 'components/MarkdownEditor';
import QuestionRenderer from 'components/Quiz/QuestionRenderer';
import { TagSelector } from 'components/Tags';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { darkTheme } from 'structsThemes';
import {
  createLesson,
  createQuiz,
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
  MultipleChoiceQuizForm,
  QuestionAnswerQuizForm,
  Quiz,
  QuizForm,
  SourceCode,
  SourceCodeForm,
  Topic,
  TopicForm,
  TrueFalseQuizForm,
} from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import styles from './ContentManagement.module.scss';
import {
  BaseQuizForm, MCQuizForm, QAQuizForm, TFQuizForm,
} from './QuizForm';

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

const emptyNewQuizForm: QuizForm = {
  type: 'mc',
  question: '',
  description: '',
  explanation: '',
};

const ContentManagementSteps: FC<Props> = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [topicFormValues, setTopicFormValues] = useState<TopicForm>(emptyTopicForm);

  const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
  const [sourceCodeFormValues, setSourceCodeFormValues] = useState<SourceCodeForm>(
    emptySourceCodeForm,
  );

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [lessonFormValues, setLessonFormValues] = useState<LessonForm>(emptyLessonForm);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizFormValues, setQuizFormValues] = useState<QuizForm>();
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(-1);

  const [newQuizFormValues, setNewQuizFormValues] = useState<QuizForm>(emptyNewQuizForm);

  const theme: Theme = useTheme();

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
    [setLessons],
  );

  const fetchQuizzes = useCallback(
    (lessonId: string) => {
      getQuizzes(lessonId)
        .then((quizzes: Quiz[]) => {
          if (!quizzes) throw Error('Invalid quizzes were retrieved');
          setQuizzes(quizzes);
          if (quizzes.length > 0) {
            setSelectedQuizIndex(0);
            setQuizFormValues(quizzes[0]);
          }
        })
        .catch((errMessage) => {
          Notification.error(`Failed to load quizzes. Reason: ${errMessage}`);
        });
    },
    [setQuizzes],
  );

  const fetchTopicSourceCode = useCallback(
    (topicId: string) => {
      getSourceCodes(topicId)
        .then((sourceCode: SourceCode[]) => setSourceCodes(sourceCode))
        .catch((errMessage) => Notification.error(`Failed to load source code. Reason: ${errMessage}`));
    },
    [setSourceCodes],
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
  }, [selectedTopicId, fetchLessons, fetchTopicSourceCode]);

  // When a lesson is selected then all its child quizzes should be fetched
  useEffect(() => {
    if (selectedLessonId) {
      fetchQuizzes(selectedLessonId);
    }
  }, [selectedLessonId, fetchQuizzes]);

  /* --------------------------- Selection Callbacks -------------------------- */

  const selectTopic = useCallback(
    (topicId: string) => {
      const selectedTopic: Topic = topics.find((topic) => topic._id === topicId);
      if (!selectedTopic) {
        return;
      }
      setSelectedTopicId(topicId);
      setTopicFormValues(selectedTopic);
      setSourceCodeFormValues({ ...sourceCodeFormValues, topicId });
      setLessonFormValues({ ...lessonFormValues, topicId });
      setActiveStep(1);
    },
    [topics, sourceCodeFormValues, lessonFormValues],
  );

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
    [lessons],
  );

  const selectQuiz = useCallback(
    (quizId: string) => {
      const selectedQuizIndex: number = quizzes.findIndex((quiz) => quiz._id === quizId);
      if (selectedQuizIndex === -1) {
        Notification.error(`Quiz doesn't seem to exist. ID: ${quizId}`);
        return;
      }
      setQuizFormValues(quizzes[selectedQuizIndex]);
      setSelectedQuizIndex(selectedQuizIndex);
    },
    [quizzes],
  );

  const deselectQuiz = useCallback(() => {
    setQuizFormValues(null);
    setSelectedQuizIndex(-1);
  }, []);

  const deselectLesson = useCallback(() => {
    deselectQuiz();
    setSelectedLessonId('');
    setLessonFormValues({
      ...emptyLessonForm,
      topicId: lessonFormValues.topicId,
      creatorId: lessonFormValues.creatorId,
    });
    setSelectedQuizIndex(-1);
  }, [lessonFormValues, deselectQuiz]);

  const deselectTopic = useCallback(() => {
    deselectLesson();
    setSelectedTopicId('');
    setTopicFormValues(emptyTopicForm);
    setLessonFormValues(emptyLessonForm);
    setSourceCodes([]);
  }, [deselectLesson]);

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
          (topic) => topic._id === selectedTopicId,
        );
        if (topicIndex === -1) throw Error('Topics data inconsistent. Please report');
        // Replace the old topic with the new one in the `topics` array to ensure that changes are reflected in the UI
        setTopics(
          topics.map((topic, i) => {
            if (topic._id === selectedTopicId) {
              return newTopic;
            }
            return topic;
          }),
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
          (lesson) => lesson._id === selectedLessonId,
        );
        if (lessonIndex === -1) throw Error('Lessons data inconsistent. Please report');
        setLessons(
          lessons.map((lesson, i) => {
            if (lesson._id === selectedLessonId) {
              return newLesson;
            }
            return lesson;
          }),
        );
      })
      .catch(Notification.error);
  }, [lessonFormValues, lessons, selectedLessonId]);

  const handleCreateQuiz = useCallback(() => {
    createQuiz(selectedLessonId, newQuizFormValues)
      .then((newQuiz) => {
        Notification.success('Created quiz');
        setQuizzes([...quizzes, newQuiz]);
        setNewQuizFormValues(emptyNewQuizForm);
      })
      .catch(Notification.error);
  }, [newQuizFormValues, quizzes, selectedLessonId]);

  const handleUpdateQuiz = useCallback(() => {
    Notification.error('Unimplemented');
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ textAlign: 'left', pb: 5 }}>
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
                {topics
                                    && topics.length > 0
                                    && topics.map((topic) => (
                                      <Grid item>
                                        <Card
                                          onClick={() => {
                                            selectedTopicId !== topic._id
                                              ? selectTopic(topic._id)
                                              : deselectTopic();
                                          }}
                                          className={styles.card}
                                          sx={{
                                            boxShadow:
                                                        selectedTopicId === topic._id
                                                        && 'rgba(0, 0, 0, 0.25) 0px 0px 10px 5px, rgba(0, 0, 0, 0.6) 0px 0px 0px 1px',
                                          }}
                                        >
                                          <CardMedia
                                            component="img"
                                            height="140"
                                            image={
                                                        topic.image
                                                        || 'https://via.placeholder.com/150'
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
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Typography
                    variant="h5"
                    color="textPrimary"
                    sx={{ textAlign: 'center' }}
                  >
                    Manage Topic
                  </Typography>
                  <HorizontalRule />
                  {/* Title */}
                  <TextField
                    required
                    sx={{ width: '100%', mb: 2, mt: 3 }}
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
                      Courses:
                    </Typography>
                    <CoursesSelector
                      courses={topicFormValues.courses}
                      addValue={(newValue: string) => setTopicFormValues({
                        ...topicFormValues,
                        courses: [...topicFormValues.courses, newValue],
                      })}
                    />
                    <TagSelector
                      selectedTags={topicFormValues.courses}
                      setSelectedTags={(tags) => setTopicFormValues({
                        ...topicFormValues,
                        courses: tags,
                      })}
                    />
                  </Box>
                </Paper>

                {/* Videos */}
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                    sx={{ textAlign: 'center' }}
                  >
                    Manage Videos
                  </Typography>
                  <HorizontalRule />
                  <List>
                    {topicFormValues.videos
                                            && topicFormValues.videos.map((videoUrl) => (
                                              <ListItem
                                                secondaryAction={(
                                                  <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    color="error"
                                                    onClick={() => Notification.info(
                                                      'Not implemented yet',
                                                    )}
                                                  >
                                                    <DeleteIcon />
                                                  </IconButton>
                                                      )}
                                              >
                                                <ListItemAvatar>
                                                  <Avatar>
                                                    <VideoIcon />
                                                  </Avatar>
                                                </ListItemAvatar>
                                                <Link href={videoUrl} color="textPrimary">
                                                  {videoUrl}
                                                </Link>
                                              </ListItem>
                                            ))}
                    <HorizontalRule />
                    <FormControl fullWidth sx={{ mt: 3 }}>
                      <Typography color="textPrimary">
                        Press Enter to add video URL:
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
                            e.target.value = '';
                          }
                        }}
                      />
                    </FormControl>
                  </List>
                </Paper>

                <Box sx={{ textAlign: 'center' }}>
                  {selectedTopicId ? (
                    <>
                      <Alert severity="warning">
                        You
                        {' '}
                        <strong>must</strong>
                        {' '}
                        click 'Submit' to create a
                        new topic or save changes before progressing!
                      </Alert>
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
                      <Alert severity="warning">
                        You
                        {' '}
                        <strong>must</strong>
                        {' '}
                        click 'Create' to create a
                        new topic or save changes before progressing!
                      </Alert>
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
                </Box>

                {/* Source Code */}
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h6"
                    sx={{ textAlign: 'center' }}
                  >
                    Manage Source Code
                  </Typography>
                  <HorizontalRule />

                  {sourceCodes
                                        && sourceCodes.map((sourceCode) => (
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
                </Paper>
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      color="textPrimary"
                      variant="h6"
                      sx={{ textAlign: 'center' }}
                    >
                      Create Source Code Snippet
                    </Typography>
                    <HorizontalRule />
                    <FormControl fullWidth>
                      <TextField
                        id="topic-source-code-title"
                        label="Title"
                        placeholder="Eg. Insertion Algorithm"
                        onChange={(e) => setSourceCodeFormValues({
                          ...sourceCodeFormValues,
                          title: String(e.target.value),
                        })}
                      />
                      <TextField
                        id="topic-source-code-code"
                        label="Source Code"
                        placeholder="void insert(...) { ... }"
                        multiline
                        variant="standard"
                        onChange={(e) => setSourceCodeFormValues({
                          ...sourceCodeFormValues,
                          code: String(e.target.value),
                        })}
                        sx={{ width: '100%' }}
                      />
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateCodeSnippet}
                      sx={{ mt: 2 }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Paper>
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
              <Grid container spacing={3} sx={{ mt: 2, mb: 2 }}>
                {lessons
                                    && lessons.map((lesson) => (
                                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                        <Card
                                          onClick={() => {
                                            selectedLessonId !== lesson._id
                                              ? selectLesson(lesson._id)
                                              : deselectLesson();
                                          }}
                                          sx={{
                                            cursor: 'pointer',
                                            boxShadow:
                                                        selectedLessonId === lesson._id
                                                        && 'rgba(0, 0, 0, 0.25) 0px 0px 10px 5px, rgba(0, 0, 0, 0.6) 0px 0px 0px 1px',
                                          }}
                                        >
                                          <CardContent>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {lesson.title}
                                            </Typography>
                                            <HorizontalRule />
                                            <Box className={styles.descriptionPreview}>
                                              <MarkdownEditor
                                                readOnly
                                                markdownValue={lesson.rawMarkdown}
                                                themeOverride={{
                                                  background:
                                                                    theme.palette.background.paper,
                                                }}
                                              />
                                            </Box>
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
            <Box>
              <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
                <TextField
                  sx={{ width: '100%' }}
                  label="Title"
                  id="lesson-title"
                  required
                  value={lessonFormValues.title}
                  onChange={(e) => setLessonFormValues({
                    ...lessonFormValues,
                    title: String(e.target.value),
                  })}
                />
                <Box sx={{ padding: 3 }}>
                  <HorizontalRule />
                  <MarkdownEditor
                    markdownValue={lessonFormValues.rawMarkdown}
                    setMarkdownValue={(newMarkdown: string) => setLessonFormValues({
                      ...lessonFormValues,
                      rawMarkdown: newMarkdown,
                    })}
                    themeOverride={{
                      background: theme.palette.background.paper,
                    }}
                    readOnly={false}
                  />
                  <HorizontalRule />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Alert severity="warning">
                    You
                    {' '}
                    <strong>must</strong>
                    {' '}
                    click 'Create' to create a new
                    topic or save changes before progressing!
                  </Alert>
                  <Button
                    color="secondary"
                    onClick={() => (selectedLessonId
                      ? handleUpdateLesson()
                      : handleCreateLesson())}
                    variant="contained"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {selectedLessonId ? 'Update' : 'Create'}
                  </Button>
                </Box>
              </Paper>
              <br />
              <Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="textPrimary">
                    Manage Quizzes
                  </Typography>
                  <Pagination
                    sx={{ display: 'inline-block', margin: 2 }}
                    count={quizzes ? quizzes.length : 0}
                    color="primary"
                    page={selectedQuizIndex + 1}
                    onChange={(_, value) => {
                      selectQuiz(quizzes[value - 1]._id);
                    }}
                  />
                </Box>

                {/* Quiz Question Update Form */}
                {quizFormValues && (
                <Paper elevation={3} sx={{ margin: 3, padding: 4 }}>
                  <Typography
                    color="textPrimary"
                    variant="h5"
                    sx={{ textAlign: 'center' }}
                  >
                    Update Quiz
                  </Typography>
                  <HorizontalRule />
                  <BaseQuizForm
                    question={quizFormValues.question}
                    description={quizFormValues.description}
                    handleChangeQuestion={(question) => setQuizFormValues((oldForm) => ({
                      ...oldForm,
                      question,
                    }))}
                    handleChangeDescription={(description) => setQuizFormValues((oldForm) => ({
                      ...oldForm,
                      description,
                    }))}
                  />
                  {quizFormValues
                                            && (quizFormValues.type === 'mc' ? (
                                              <MCQuizForm
                                                choices={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .choices
                                                        }
                                                handleChangeChoices={(newChoices) => {
                                                  setQuizFormValues((oldForm) => ({
                                                    ...oldForm,
                                                    choices: newChoices,
                                                  }));
                                                }}
                                                answers={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .answers
                                                        }
                                                handleChangeAnswers={(answers) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  answers,
                                                }))}
                                                maxSelections={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .maxSelections
                                                        }
                                                handleChangeMaxSelections={(
                                                  maxSelections,
                                                ) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  maxSelections,
                                                }))}
                                                correctMessage={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .correctMessage
                                                        }
                                                handleChangeCorrectMessage={(
                                                  correctMessage,
                                                ) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  correctMessage,
                                                }))}
                                                incorrectMessage={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .incorrectMessage
                                                        }
                                                handleChangeIncorrectMessage={(
                                                  incorrectMessage,
                                                ) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  incorrectMessage,
                                                }))}
                                                explanation={
                                                            (quizFormValues as MultipleChoiceQuizForm)
                                                              .explanation
                                                        }
                                                handleChangeExplanation={(explanation) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : quizFormValues.type === 'tf' ? (
                                              <TFQuizForm
                                                isTrue={
                                                        (quizFormValues as TrueFalseQuizForm).isTrue
                                                    }
                                                handleChangeIsTrue={(isTrue) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  isTrue,
                                                }))}
                                                correctMessage={
                                                        (quizFormValues as TrueFalseQuizForm)
                                                          .correctMessage
                                                    }
                                                handleChangeCorrectMessage={(correctMessage) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  correctMessage,
                                                }))}
                                                incorrectMessage={
                                                        (quizFormValues as TrueFalseQuizForm)
                                                          .incorrectMessage
                                                    }
                                                handleChangeIncorrectMessage={(
                                                  incorrectMessage,
                                                ) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  incorrectMessage,
                                                }))}
                                                explanation={
                                                        (quizFormValues as TrueFalseQuizForm)
                                                          .explanation
                                                    }
                                                handleChangeExplanation={(explanation) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : quizFormValues.type === 'qa' ? (
                                              <QAQuizForm
                                                explanation={
                                                        (quizFormValues as QuestionAnswerQuizForm)
                                                          .explanation
                                                    }
                                                handleChangeExplanation={(explanation) => setQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : (
                                              <>Invalid question type</>
                                            ))}
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={handleUpdateQuiz}
                  >
                    Update
                  </Button>
                </Paper>
                )}

                {/* Quiz Preview */}
                {quizFormValues && (
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ textAlign: 'center' }}
                  >
                    Quiz Question Preview:
                  </Typography>
                  <HorizontalRule />
                  <QuestionRenderer
                    quiz={quizFormValues}
                    disabled
                    showAnswers
                  />
                </Paper>
                )}

                {/* Quiz Question Creation */}
                <HorizontalRule />
                {newQuizFormValues && (
                <Paper elevation={3} sx={{ margin: 3, padding: 4 }}>
                  <Typography variant="h5" sx={{ textAlign: 'center' }}>
                    Create Question
                  </Typography>
                  <HorizontalRule />
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="quiz-question-type">
                      Question Type
                    </InputLabel>
                    <NativeSelect
                      inputProps={{
                        id: 'quiz-question-type',
                        value:
                                                        newQuizFormValues && newQuizFormValues.type,
                        defaultValue: newQuizFormValues
                          ? newQuizFormValues.type
                          : 'mc',
                      }}
                      sx={{
                        background:
                                                        theme === darkTheme
                                                        && theme.palette.primary.main,
                      }}
                      onChange={(e) => setNewQuizFormValues({
                        ...newQuizFormValues,
                        type: String(e.target.value),
                      })}
                    >
                      <option value="mc">Multiple Choice</option>
                      <option value="tf">True/False</option>
                      <option value="qa">Question-Answer</option>
                    </NativeSelect>
                  </FormControl>
                  <BaseQuizForm
                    question={newQuizFormValues.question}
                    description={newQuizFormValues.description}
                    handleChangeQuestion={(question) => setNewQuizFormValues({
                      ...newQuizFormValues,
                      question,
                    })}
                    handleChangeDescription={(description) => setNewQuizFormValues({
                      ...newQuizFormValues,
                      description,
                    })}
                  />
                  {newQuizFormValues
                                            && (newQuizFormValues.type === 'mc' ? (
                                              <MCQuizForm
                                                choices={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .choices || []
                                                        }
                                                handleChangeChoices={(newChoices) => {
                                                  setNewQuizFormValues((oldForm) => ({
                                                    ...oldForm,
                                                    choices: newChoices,
                                                  }));
                                                }}
                                                answers={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .answers || []
                                                        }
                                                handleChangeAnswers={(answers) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  answers,
                                                }))}
                                                maxSelections={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .maxSelections
                                                        }
                                                handleChangeMaxSelections={(
                                                  maxSelections,
                                                ) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  maxSelections,
                                                }))}
                                                correctMessage={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .correctMessage
                                                        }
                                                handleChangeCorrectMessage={(
                                                  correctMessage,
                                                ) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  correctMessage,
                                                }))}
                                                incorrectMessage={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .incorrectMessage
                                                        }
                                                handleChangeIncorrectMessage={(
                                                  incorrectMessage,
                                                ) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  incorrectMessage,
                                                }))}
                                                explanation={
                                                            (newQuizFormValues as MultipleChoiceQuizForm)
                                                              .explanation
                                                        }
                                                handleChangeExplanation={(explanation) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : newQuizFormValues.type === 'tf' ? (
                                              <TFQuizForm
                                                isTrue={
                                                        (newQuizFormValues as TrueFalseQuizForm)
                                                          .isTrue
                                                    }
                                                handleChangeIsTrue={(isTrue) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  isTrue,
                                                }))}
                                                correctMessage={
                                                        (newQuizFormValues as TrueFalseQuizForm)
                                                          .correctMessage
                                                    }
                                                handleChangeCorrectMessage={(correctMessage) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  correctMessage,
                                                }))}
                                                incorrectMessage={
                                                        (newQuizFormValues as TrueFalseQuizForm)
                                                          .incorrectMessage
                                                    }
                                                handleChangeIncorrectMessage={(
                                                  incorrectMessage,
                                                ) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  incorrectMessage,
                                                }))}
                                                explanation={
                                                        (newQuizFormValues as TrueFalseQuizForm)
                                                          .explanation
                                                    }
                                                handleChangeExplanation={(explanation) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : newQuizFormValues.type === 'qa' ? (
                                              <QAQuizForm
                                                explanation={
                                                        (newQuizFormValues as QuestionAnswerQuizForm)
                                                          .explanation
                                                    }
                                                handleChangeExplanation={(explanation) => setNewQuizFormValues((oldForm) => ({
                                                  ...oldForm,
                                                  explanation,
                                                }))}
                                              />
                                            ) : (
                                              <></>
                                            ))}

                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleCreateQuiz}
                    sx={{ mt: 2 }}
                  >
                    Create
                  </Button>
                </Paper>
                )}

                {/* Quiz Preview */}
                {newQuizFormValues && (
                <Paper elevation={3} sx={{ margin: 3, padding: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ textAlign: 'center' }}
                  >
                    Quiz Question Preview:
                  </Typography>
                  <HorizontalRule />
                  <QuestionRenderer
                    quiz={newQuizFormValues}
                    disabled
                    showAnswers
                  />
                </Paper>
                )}
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
              {/* <pre>{JSON.stringify(newQuizFormValues, null, 4)}</pre> */}
              {/* <pre>{JSON.stringify(quizFormValues, null, 4)}</pre> */}
              {/* <pre>{JSON.stringify(lessonFormValues, null, 4)}</pre> */}
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default ContentManagementSteps;
