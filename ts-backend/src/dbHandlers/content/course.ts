import { CourseModel } from '../../schemas/content/course';
import { Lesson } from '../../model/content/Lesson';
import { Course, CourseWithLessons } from '../../model/content/Course';
import { CreateCourseInput } from '../../model/input/content/CreateCourseInput';
import { UpdateCourseInput } from '../../model/input/content/UpdateCourseInput';
import { LessonModel } from '../../schemas/content/lesson';
import { checkObjectIdIsValid } from '../../utils';

/**
 * Database controller for the user collection in GalacticEd
 */
export class CourseMongoService {
  /**
   * Get all Courses stored in GalacticEd
   */
  public async getAllCourses(): Promise<Course[]> {
    try {
      return (await CourseModel.find({})) as Course[];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a course by id from GalacticEd's content system
   */
  public async getCourseById(id: string): Promise<Course> {
    try {
      return (await CourseModel.findById(id)) as Course;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private async getLessons(lessonIds: string[]): Promise<Lesson[]> {
    try {
      const lessons = (await LessonModel.find({
        _id: {
          $in: lessonIds,
        },
      })) as Lesson[];
      return lessons;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public getCourseOfLesson = async (lessonId: string): Promise<Course> => {
    try {
      checkObjectIdIsValid(lessonId);
      const course = (await CourseModel.findOne({
        lessonIds: lessonId,
      })) as Course;
      if (!course)
        throw new Error(`Failed to find a course that has the ID: ${lessonId}`);
      return course;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  /**
   * Get all courses and their lessons together
   */
  public async getCoursesWithLessons(): Promise<CourseWithLessons[]> {
    try {
      const allCourses: Course[] = await this.getAllCourses();

      try {
        // Run all lesson queries in parallel
        const lessonQueries: Promise<Lesson[]>[] = allCourses.map((course) => {
          return this.getLessons(course.lessonIds);
        });
        const allLessons: Lesson[][] = await Promise.all(lessonQueries);

        // Package up each course and their lessons into one object and return an array of them
        const allCoursesWithLessons: CourseWithLessons[] = allCourses.map(
          (course, i) => {
            const courseWithLessons: CourseWithLessons = {
              course: course,
              lessons: allLessons[i],
            };
            return courseWithLessons;
          }
        );
        return allCoursesWithLessons;
      } catch (err) {
        throw new Error(err.message);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a new course in GalacticEd's content system
   */
  public async createCourse(course: CreateCourseInput): Promise<Course> {
    try {
      return (await CourseModel.create({
        ...course,
      })) as Course;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get course by name from GalacticEd's content system
   */
  public async getCourseByName(courseName: string): Promise<Course> {
    try {
      return (await CourseModel.findOne({ courseName: courseName })) as Course;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update an existing course in GalacticEd's content system
   */
  public async updateCourse(course: UpdateCourseInput): Promise<Course> {
    try {
      await CourseModel.updateOne({ _id: course._id }, { ...course });
      return (await CourseModel.findById(course._id)) as Course;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a course from GalacticEd's content system
   */
  public async deleteCourse(id: string): Promise<void> {
    try {
      await CourseModel.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
