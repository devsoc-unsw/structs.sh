import { CreateCourseInput } from 'src/model/input/content/CreateCourseInput';
import { CreateQuestionInput } from 'src/model/input/content/CreateQuestionInput';
import { UpdateCourseInput } from 'src/model/input/content/UpdateCourseInput';
import { UpdateQuestionInput } from 'src/model/input/content/UpdateQuestionInput';
import { CourseMongoService } from '../../../dbHandlers/content/course';
import { LessonMongoService } from '../../../dbHandlers/content/lesson';
import { QuestionMongoService } from '../../../dbHandlers/content/question';
import { SessionMongoService } from '../../../dbHandlers/session';
import { CreateLessonInput } from '../../../model/input/content/CreateLessonInput';
import { UpdateLessonInput } from '../../../model/input/content/UpdateLessonInput';
import axios from 'axios';
import fs from 'fs';

// import { CreateComponentInput } from 'src/model/input/content/CreateComponentInput';
// import { UpdateComponentInput } from 'src/model/input/content/UpdateComponentInput';

const lessonService = new LessonMongoService();
const courseService = new CourseMongoService();
const questionService = new QuestionMongoService();
const sessionService = new SessionMongoService();
// const componentService = new ComponentMongoService();

/**
 * All resolvers for the Content Domain - here we look at lessons.
 */
export const contentResolvers = {
  Query: {
    /**
     * Course Queries
     */
    getAllCourses: async () => {
      return await courseService.getAllCourses();
    },
    getCourseById: async (_, args: { id: string }) => {
      return await courseService.getCourseById(args.id);
    },
    getCoursesWithLessons: async () => {
      return await courseService.getCoursesWithLessons();
    },
    getCourseByName: async (_, args: { courseName: string }) => {
      return await courseService.getCourseByName(args.courseName);
    },
    getCourseOfLesson: async (_, args: { lessonId: string }) => {
      return await courseService.getCourseOfLesson(args.lessonId);
    },
    /**
     * Lesson Queries
     */
    getAllLessons: async () => {
      return await lessonService.getAllLessons();
    },
    getLessonById: async (_, args: { id: string }) => {
      return await lessonService.getLessonById(args.id);
    },
    getLessonsById: async (_, args: { lessonIds: string[] }) => {
      return await lessonService.getLessonsById(args.lessonIds);
    },
    getLessonQuestions: async (_, args: { id: string }) => {
      return await lessonService.getLessonQuestions(args.id);
    },
    /**
     * Question Queries
     */
    getQuestionById: async (_, args: { id: string }) => {
      return await questionService.getQuestionById(args.id);
    },
  },
  Mutation: {
    /**
     * Course Mutations
     */
    createCourse: async (_, args: { course: CreateCourseInput }) => {
      return await courseService.createCourse(args.course);
    },
    updateCourse: async (_, args: { course: UpdateCourseInput }) => {
      return await courseService.updateCourse(args.course);
    },
    deleteCourse: async (_, args: { id: string }) => {
      return await courseService.deleteCourse(args.id);
    },
    /**
     * Lesson Mutations
     */
    createLesson: async (_, args: { lesson: CreateLessonInput }) => {
      return await lessonService.createLesson(args.lesson);
    },
    addQuestionToLesson: async (
      _,
      args: { lessonId: string; questionId: string }
    ) => {
      return await lessonService.addQuestionToLesson(
        args.lessonId,
        args.questionId
      );
    },
    updateLesson: async (_, args: { lesson: UpdateLessonInput }) => {
      return await lessonService.updateLesson(args.lesson);
    },
    deleteLesson: async (_, args: { id: string }) => {
      return await lessonService.deleteLesson(args.id);
    },
    updateLessonQuestions: async (
      _,
      args: { lessonId: string; questions: [CreateQuestionInput] }
    ) => {
      return await lessonService.updateLessonQuestions(
        args.lessonId,
        args.questions
      );
    },
    /**
     * Question Mutations
     */
    createQuestion: async (_, args: { question: CreateQuestionInput }) => {
      return await questionService.createQuestion(args.question);
    },
    updateQuestion: async (_, args: { question: UpdateQuestionInput }) => {
      return await questionService.updateQuestion(args.question);
    },
    deleteQuestion: async (_, args: { id: string }) => {
      return await questionService.deleteQuestion(args.id);
    },

    /**
     * Session Mutations
     */
    /** Gets the reccomended session for a child */
    recommendSession: async (_, args: { child_id: string }) => {
      return await sessionService.getRecommendedSession(args.child_id);
    },
    // /**
    //  * Component Mutations
    //  */
    // createComponent: async (_, args: { ticket: CreateComponentInput }) => {
    //   return componentService.createComponent(args.ticket);
    // },
    // updateComponent: async (_, args: { ticket: UpdateComponentInput }) => {
    //   return componentService.updateComponent(args.ticket);
    // },
    // deleteComponent: async (_, args: { id: string }) => {
    //   return componentService.deleteComponent(args.id);
    // },
  },
};
