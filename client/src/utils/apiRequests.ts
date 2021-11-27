import axios from 'axios';
import { ApiConstants } from 'constants/api';

// TODO: it could be a good idea to set up a yarn workspace, create a `common` directory and put all these TypeScript definitions for data models in that directory so they can be shared between client and server (since both use TypeScript)
// This would also also make input validation easier -- you write it once for both client and server rather than doing both independently.

export interface User {
    username: string;
    email: string;
    password: string;
}

export interface Quiz {
    questionType: string;
    question: string;
    answer: string;
}

export interface Lesson {
    topicId: string;
    title: string;
    rawMarkdown: string;
    creatorId: string;
    quizzes: Quiz[];
}

export interface Topic {
    _id: string;
    title: string;
    description: string;
    courses: string[];
    videos: string[];
    sourceCodeIds: string[];
    image: string;
}

export interface SourceCode {
    topicId: string;
    title: string;
    code: string;
}

type GetLessons = (topicId: string) => Promise<Lesson[]>;
type GetQuizzes = (lessonId: string) => Promise<Quiz[]>;
type GetTopics = () => Promise<Topic[]>;
type GetSourceCode = (topicId: string) => Promise<SourceCode[]>;

type CreateLesson = (lesson: Lesson) => Promise<Lesson>;
type CreateQuiz = (lessonId: string, quiz: Quiz) => Promise<Quiz>;
type CreateTopic = (topic: Topic) => Promise<Topic>;
type CreateSourceCode = (sourceCode: SourceCode) => Promise<SourceCode>;

type EditLesson = (lessonId: string, newLesson: Lesson) => Promise<Lesson>;
type EditQuiz = (quizId: string, newQuiz: Quiz) => Promise<Quiz>;
type EditTopic = (topicId: string, newTopic: Topic) => Promise<Topic>;
type EditSourceCode = (sourceCodeId: string, newSourceCode: SourceCode) => Promise<SourceCode>;

export const getLessons: GetLessons = async (topicId: string) => {
    try {
        const response = await axios.get(`${ApiConstants.URL}/api/lessons?topicId=${topicId}`);
        const lessons: Lesson[] = response.data.lessons as Lesson[];
        return lessons;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

export const getQuizzes: GetQuizzes = async (lessonId: string) => {
    try {
        const response = await axios.get(`${ApiConstants.URL}/api/quiz?lessonId=${lessonId}`);
        const quizzes: Quiz[] = response.data.quizzes as Quiz[];
        return quizzes;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

export const getTopics: GetTopics = async () => {
    try {
        const response = await axios.get(`${ApiConstants.URL}/api/topics`);
        const topics: Topic[] = response.data.topics;
        return topics;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

export const getSourceCodes: GetSourceCode = async (topicId: string) => {
    try {
        const response = await axios.get(`${ApiConstants.URL}/api/source-code?topicId=${topicId}`);
        const sourceCode: SourceCode[] = response.data.sourceCode;
        return sourceCode;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const createLesson: CreateLesson = async (lesson: Lesson) => {
    try {
        const response = await axios.post(`${ApiConstants.URL}/api/lessons`, lesson, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.lesson as Lesson;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const createQuiz: CreateQuiz = async (lessonId: string, quiz: Quiz) => {
    try {
        const response = await axios.post(
            `${ApiConstants.URL}/api/quiz`,
            {
                lessonId: lessonId,
                ...quiz,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data.quiz as Quiz;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const createTopic: CreateTopic = async (topic: Topic) => {
    try {
        const response = await axios.post(`${ApiConstants.URL}/api/topics`, topic, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.topic as Topic;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const createSourceCode: CreateSourceCode = async (sourceCode: SourceCode) => {
    try {
        const response = await axios.post(`${ApiConstants.URL}/api/source-code`, sourceCode, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.topic as SourceCode;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const editLesson: EditLesson = async (lessonId: string, newLesson: Lesson) => {
    try {
        const response = await axios.put(`${ApiConstants.URL}/api/lessons/${lessonId}`, newLesson, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.lesson as Lesson;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const editQuiz: EditQuiz = async (quizId: string, newQuiz: Quiz) => {
    try {
        const response = await axios.put(`${ApiConstants.URL}/api/quiz/${quizId}`, newQuiz, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.quiz as Quiz;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const editTopic: EditTopic = async (topicId: string, newTopic: Topic) => {
    try {
        const response = await axios.put(`${ApiConstants.URL}/api/topics/${topicId}`, newTopic, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.topic as Topic;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};

// TODO: Untested and unimplemented in backend
export const editSourceCode: EditSourceCode = async (
    sourceCodeId: string,
    newSourceCode: SourceCode
) => {
    try {
        const response = await axios.put(
            `${ApiConstants.URL}/api/source-code/${sourceCodeId}`,
            newSourceCode,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data.sourceCode as SourceCode;
    } catch (err) {
        const errMessage: string = err.response.data.statusText;
        throw errMessage;
    }
};
