import { CourseMongoService } from '../../../dbHandlers/content/course';
import { Course } from 'src/model/content/Course';
import { Lesson } from 'src/model/content/Lesson';
import { CreateSessionInput } from 'src/model/input/session/CreateSessionInput';
import { UpdateSessionProgressInput } from 'src/model/input/session/UpdateSessionProgressInput';
import { UpdateSessionPropertiesInput } from 'src/model/input/session/UpdateSessionPropertiesInput';
import { FullSession, Session } from 'src/model/session/Session';
import { LessonMongoService } from '../../../dbHandlers/content/lesson';
import { SessionMongoService } from '../../../dbHandlers/session';
import { StatisticsMongoService } from '../../../dbHandlers/statistics';
import { UserMongoService } from '../../../dbHandlers/user';
import { checkObjectIdIsValid } from '../../../utils';

const userService = new UserMongoService();
const sessionService = new SessionMongoService();
const statsService = new StatisticsMongoService();
const lessonService = new LessonMongoService();
const courseService = new CourseMongoService();

/**
 * All resolvers for the Content Domain - here we look at lessons.
 */
export const sessionResolver = {
  Query: {
    /** Get the child's next session to do */
    getCurrentSessionForChild: async (
      _,
      args: { childId: string }
    ): Promise<FullSession> => {
      const { childId } = args;
      // Get the child's most recent session
      const child = await userService.getChildById(childId);
      const targetSessionId = child.currentSessionId;

      // The child has no current session ID
      if (!targetSessionId) return null;

      let currentSession: any = await sessionService.getSession(
        targetSessionId
      );

      // Retrieving all lesson documents
      const lessons = (await lessonService.getLessonsById(
        currentSession.lessonIds
      )) as Lesson[];

      // Retrieving the course for each lesson
      const courseQueries: Promise<Course>[] = lessons.map((lesson) =>
        courseService.getCourseById(lesson.courseId)
      );
      const allCourses = (await Promise.all(courseQueries)) as Course[];
      const lessonsAndCourse = lessons.map((lesson, i) => ({
        lesson: lesson,
        course: allCourses[i],
      }));
      currentSession.lessons = lessonsAndCourse;
      delete currentSession.lessonIds;

      return currentSession as FullSession;
    },
    /** Get the child's next session to do */
    getAllSessionsForChild: async (_, args: { childId: string }) => {
      const { childId } = args;
      const child = await userService.getChildById(childId);
      const sessions = await sessionService.getSessionsById(child.sessionIds);
      return await sessions;
    },
    /** Get a session by its id */
    getSessionById: async (_, args: { id: string }) => {
      return await sessionService.getSessionById(args.id);
    },
    /** Get all sessions */
    getAllSessions: async () => {
      return await sessionService.getAllSessions();
    },
  },
  Mutation: {
    /**
     * Creating a new session with prescribed lessons for the child
     */
    createSession: async (_, args: { session: CreateSessionInput }) => {
      const { session } = args;
      if (!session.childId) throw new Error('Child ID must be specified');
      if (!session.lessonIds || session.lessonIds.length <= 0)
        throw new Error('There must be at least 1 lesson in this session');

      const child = await userService.getChildById(session.childId);
      const createdSession = await sessionService.createSession(session);

      userService.updateChild({
        _id: child.id,
        // Push the newly created session to the list of sessions planned for the child
        // TODO: implement sorted session insertion if we're going with the chronological ordering idea?
        sessionIds: [...child.sessionIds, createdSession._id],
        // If this is the first session prescribed to a child, then set their current session
        // to be the newly created session
        currentSessionId: child.currentSessionId || createdSession._id,
      });

      return createdSession;
    },
    /**
     * Updating an existing session for a child
     */
    updateSessionProperties: async (
      _,
      args: { session: UpdateSessionPropertiesInput }
    ) => {
      const { session } = args;
      return await sessionService.updateSessionProperties(session);
    },
    /**
     * Updating an existing session for a child
     */
    updateSessionProgress: async (
      _,
      args: { session: UpdateSessionProgressInput }
    ) => {
      const { session } = args;
      return await sessionService.updateSessionProgress(session);
    },
    /**
     * Progresses the child to the next lesson in this session, if it exists,
     * otherwise marks the completion of this session
     */
    progressToNextLesson: async (_, args: { sessionId: string }) => {
      checkObjectIdIsValid(args.sessionId);
      const session = (await sessionService.getSessionById(
        args.sessionId
      )) as Session;

      if (!session.activeLessonId)
        throw new Error('No active lesson. Did you start the session?');
      const activeLessonIdIndex: number = session.lessonIds.findIndex(
        (id) => id === session.activeLessonId
      );
      if (activeLessonIdIndex === -1) {
        throw new Error(
          `Failed to find lesson with ID ${session.activeLessonId} in this session`
        );
      }
      console.log(`Current lesson id's index: ${activeLessonIdIndex}`);

      const updateSessionInput: Partial<UpdateSessionProgressInput> = {
        _id: args.sessionId,
      };
      if (activeLessonIdIndex === session.lessonIds.length - 1) {
        // When the active lesson is the last, that means the child has completed the course
        if (!session.completed) {
          updateSessionInput.endTime = Math.floor(Date.now() / 1000);
        }
        updateSessionInput.completed = true;
        updateSessionInput.activeLessonId = '';
      } else {
        updateSessionInput.activeLessonId =
          session.lessonIds[activeLessonIdIndex + 1];
        // If the session has not been completed yet, then record the end time
        if (!session.completed) {
          updateSessionInput.endTime = Math.floor(Date.now() / 1000);
        }
      }
      await sessionService.updateSessionProgress(updateSessionInput);
      return await sessionService.getSessionById(args.sessionId);
    },
    /**
     * Starts the session. Only affects the session document when the first question of
     * the first lesson is started
     */
    startSession: async (_, args: { sessionId: string }) => {
      checkObjectIdIsValid(args.sessionId);
      const session = (await sessionService.getSessionById(
        args.sessionId
      )) as Session;

      const updateSessionInput: Partial<UpdateSessionProgressInput> = {
        _id: args.sessionId,
      };
      // The session is being started for the first time
      if (!session.completed && !session.startTime) {
        updateSessionInput.startTime = Math.floor(Date.now() / 1000);
        updateSessionInput.endTime = session.startTime;
        updateSessionInput.activeLessonId = session.lessonIds[0];
        await sessionService.updateSessionProgress(updateSessionInput);
      } else {
        throw new Error('Session has already been started');
      }
      return await sessionService.getSessionById(args.sessionId);
    },
    /**
     * Deleting an existing session for a child
     */
    deleteSession: async (_, args: { childId: string; sessionId: string }) => {
      const { childId, sessionId } = args;
      checkObjectIdIsValid(childId);
      checkObjectIdIsValid(sessionId);

      // Deleting this session from the child it's attached to
      // TODO: this could be optimised to take fewer round trips
      // const session = await sessionService.getSessionById(sessionId);
      const child = await userService.getChildById(childId);

      const targetSessionIndex = child.sessionIds.findIndex(
        (id) => id === sessionId
      );
      if (targetSessionIndex === -1)
        throw new Error(`The session with ID ${sessionId} doesn't exist`);

      let newCurrentSessionId = child.currentSessionId;
      // When the session being deleted is equal to the currently active session, we need
      // to ensure that the current session is moved to the next valid session, if it exists,
      // otherwise it should be set to the previous valid session, or null if that also doesn't
      // exist
      if (child.sessionIds[targetSessionIndex] === child.currentSessionId) {
        if (child.sessionIds.length <= 1) {
          // If there is only 1 element in the child's list of sessions, then clear the current session ID
          newCurrentSessionId = '';
        } else if (targetSessionIndex === child.sessionIds.length - 1) {
          // Current session is at the end of the sessions list. Take on the previous session
          newCurrentSessionId = child.sessionIds[targetSessionIndex - 1];
        } else {
          // Set the current session to be the next valid session as the replacement
          newCurrentSessionId = child.sessionIds[targetSessionIndex + 1];
        }
      }
      const newSessionIds = child.sessionIds.filter((id) => id !== sessionId);
      await userService.updateChild({
        _id: child._id,
        sessionIds: newSessionIds,
        currentSessionId: newCurrentSessionId,
      });
      // Deleting all statistics which this session is associated with
      await statsService.deleteStatisticsInSession(sessionId);
      return await sessionService.deleteSession(sessionId);
    },
    /**
     * Sets the child's current session. Should be called whenever the child completes a session
     * and is to be progressed to the next session, or when the parent wants to explicitly specify
     * which session to use
     */
    setChildCurrentSession: async (
      _,
      args: { childId: string; sessionId: string }
    ) => {
      const { childId, sessionId } = args;
      if (!sessionId) throw new Error('Session ID must not be empty');
      // Note: child.currentSessionId should always have a value unless child.sessionIds is also empty
      const child = await userService.getChildById(childId);
      if (!child.sessionIds.includes(sessionId))
        throw new Error(
          "That session doesn't exist in this child's list of sessions"
        );

      const updatedChild = userService.updateChild({
        _id: childId,
        currentSessionId: sessionId,
      });
      return true;
    },
    /**
     *
     * @param _
     * @param args
     */
    progressChildToNextSession: async (
      _,
      args: { childId: string }
    ): Promise<boolean> => {
      const { childId } = args;
      const child = await userService.getChildById(childId);

      if (!child.sessionIds)
        throw new Error('This child has no sessions prescribed to them');
      if (!child.currentSessionId)
        throw new Error(
          'This child has no current session. Data integrity is compromised'
        );

      // You cannot progress to the next session if the current one is the last one in the list of sessions (which is ordered
      // chronologically and prescribed to be taken in that order)
      if (
        child.currentSessionId === child.sessionIds[child.sessionIds.length - 1]
      ) {
        return false;
      }

      // 'Increment' the child's current session
      const oldIndex = child.sessionIds.findIndex(
        (id) => id === child.currentSessionId
      );
      await userService.updateChild({
        _id: childId,
        currentSessionId: child.sessionIds[oldIndex + 1],
      });
      return true;
    },

    recommendSession: async (_, args: { childId: string }) => {
      throw new Error('Unimplemented');
      // TODO: Implement me
      // const { childId } = args;
      // const child = await userService.getChildById(childId);

      // return null;
    },
  },
};
