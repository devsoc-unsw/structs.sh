import BulletIcon from '@mui/icons-material/KeyboardArrowRight';
import RightChevronIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { HorizontalRule } from 'components/HorizontalRule';
import { LineLoader } from 'components/Loader';
import { MarkdownEditor } from 'components/MarkdownEditor';
import { LessonQuiz } from 'components/Quiz';
import { motion } from 'framer-motion';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  getLessons, getQuizzes, Lesson, Quiz, Topic,
} from 'utils/apiRequests';
import Notification from 'utils/Notification';
import styles from './Lesson.module.scss';

interface Props {
  topic: Topic;
}

const LessonContent: FC<Props> = ({ topic }) => {
  const theme: Theme = useTheme();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [activeLesson, setActiveLesson] = useState<number>(-1);
  const [quizActive, setQuizActive] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLessons(topic._id)
      .then((newLessons) => {
        setLessons(newLessons);
        setLoading(false);
      })
      .catch((errMessage) => {
        Notification.error(errMessage);
        setLoading(false);
      });
  }, [topic]);

  useEffect(() => {
    if (!(activeLesson >= 0 && activeLesson < lessons.length)) {
      return;
    }
    getQuizzes(lessons[activeLesson]._id)
      .then((fetchedQuizzes) => {
        setQuizzes(fetchedQuizzes);
      })
      .catch(Notification.error);
  }, [activeLesson, lessons]);

  const deselectLesson = useCallback(() => {
    setQuizActive(false);
    setActiveLesson(-1);
    setQuizzes([]);
  }, []);

  return (
    <div className={styles.lessonContainer}>
      {loading && <LineLoader />}

      {!lessons && !loading && (
        <Alert
          severity="error"
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Can&apos;t find anything for &apos;
          {topic.title}
          &apos;
        </Alert>
      )}

      {lessons && lessons.length < 1 && !loading && (
        <Alert severity="info">It looks like no lessons have been written yet.</Alert>
      )}

      {/* Table of Contents */}
      {lessons && lessons.length > 0 && activeLesson === -1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography color="textPrimary" variant="h4">
            {topic.title}
            {' '}
            Lessons
          </Typography>
          <HorizontalRule />
          <List>
            {lessons.map((lesson, idx) => (
              <ListItem key={idx}>
                <Button
                  sx={{
                    textTransform: 'none',
                  }}
                  onClick={() => setActiveLesson(idx)}
                >
                  <ListItemIcon>
                    <BulletIcon sx={{ fill: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <Typography color={theme.palette.info.main}>
                    {lesson.title}
                  </Typography>
                </Button>
              </ListItem>
            ))}
          </List>
        </motion.div>
      )}
      {/* Lesson Content (and Quiz) */}
      {lessons && activeLesson >= 0 && activeLesson < (lessons.length || 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
          >
            <Breadcrumbs
              separator={<RightChevronIcon fontSize="small" />}
              aria-label="breadcrumb"
              className={styles.breadcrumbs}
            >
              <Button
                sx={{ color: theme.palette.info.main, textTransform: 'none' }}
                onClick={() => deselectLesson()}
              >
                {topic.title}
              </Button>
              <Button
                sx={{
                  textTransform: 'none',
                  color: quizActive
                    ? theme.palette.info.main
                    : theme.palette.text.disabled,
                }}
                onClick={() => {
                  if (quizActive) setQuizActive(false);
                }}
              >
                {lessons[activeLesson].title}
              </Button>
            </Breadcrumbs>
            <Button
              color="info"
              variant="contained"
              onClick={() => setQuizActive(!quizActive)}
            >
              {quizActive ? 'Lesson' : 'Quiz'}
            </Button>
          </Box>
          <HorizontalRule />

          {quizActive ? (
            <LessonQuiz quizzes={quizzes} />
          ) : (
            <MarkdownEditor
              markdownValue={lessons[activeLesson].rawMarkdown}
              readOnly
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LessonContent;
