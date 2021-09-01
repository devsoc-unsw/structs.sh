import { isValidObjectId } from 'mongoose';
import { CreateSessionInput } from 'src/model/input/session/CreateSessionInput';
import { UpdateSessionProgressInput } from 'src/model/input/session/UpdateSessionProgressInput';
import { UpdateSessionPropertiesInput } from 'src/model/input/session/UpdateSessionPropertiesInput';
import { Session } from 'src/model/session/Session';
import { checkObjectIdIsValid } from '../utils';
import { SessionModel } from '../schemas/session/session';

export class SessionMongoService {
  /**
   * Get all Sessions stored in GalacticEd
   */
  public async getAllSessions(): Promise<Session[]> {
    try {
      return (await SessionModel.find({})) as Session[];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a session by id from GalacticEd's database
   */
  public async getSessionById(id: string): Promise<Session> {
    try {
      const session = (await SessionModel.findById(id)) as Session;
      if (!session) throw new Error(`Couldn't find a session with ID: ${id}`);
      return session;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get all sessions matching the given array of IDs
   */
  public async getSessionsById(ids: string[]): Promise<Session[]> {
    try {
      // const = (await SessionModel.find({
      //   _id: {
      //     $in: ids,
      //   },
      //  })) as Session[];

      const sessionQueries: Promise<Session>[] = ids.map(
        (id) => SessionModel.findById(id).exec() as Promise<Session>
      ) as Promise<Session>[];

      const sessions = (await Promise.all(sessionQueries)) as Session[];
      return sessions;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a new session from the reccomendation engine
   */
  public async getRecommendedSession(child_id: string): Promise<Session> {
    try {
      // TODO
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getSession(sessionId: string): Promise<Session> {
    try {
      const session = (await SessionModel.findById(sessionId)) as Session;
      if (!session)
        throw new Error(`Failed to find the session with ID: ${sessionId}`);
      return session;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async createSession(session: CreateSessionInput): Promise<Session> {
    try {
      if (!session.lessonIds || session.lessonIds.length <= 0)
        throw new Error(
          'A session must contain at least 1 lesson to be created'
        );
      // TODO: Should check whether lessonIds contains IDs of existing lessons to protect data integrity
      const newSession = (await SessionModel.create({
        ...session,
        activeLessonId: session.lessonIds[0],
        completed: false,
        startTime: 0,
        endTime: 0,
      })) as Session;
      return newSession;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async updateSessionProperties(
    session: UpdateSessionPropertiesInput
  ): Promise<Session> {
    try {
      checkObjectIdIsValid(session._id);
      const updatedSession = (await SessionModel.findByIdAndUpdate(
        session._id,
        session
      )) as Session;
      if (!updatedSession)
        throw new Error(
          `Failed to find and update session with ID: ${session._id}`
        );
      return updatedSession;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async updateSessionProgress(
    session: Partial<UpdateSessionProgressInput>
  ): Promise<Session> {
    try {
      checkObjectIdIsValid(session._id);
      const updatedSession = (await SessionModel.findByIdAndUpdate(
        session._id,
        session
      )) as Session;
      if (!updatedSession)
        throw new Error(
          `Failed to find and update session with ID: ${session._id}`
        );
      return updatedSession;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async deleteSession(sessionId: string): Promise<Session> {
    try {
      const deletedSession = (await SessionModel.findByIdAndRemove(
        sessionId
      )) as Session;
      return deletedSession;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
