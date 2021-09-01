import { CreateChildInput } from 'src/model/input/user/CreateChildInput';
import { UpdateUserInput } from 'src/model/input/user/UpdateUserInput';
import { CreateUserInput } from '../model/input/user/CreateUserInput';
import { User } from '../model/user/User';
import { UserModel } from '../schemas/user/user';
import { ChildModel } from '../schemas/user/child';
import { Child } from 'src/model/user/Child';
import { UpdateChildInput } from 'src/model/input/user/UpdateChildInput';
import { checkObjectIdIsValid } from '../utils';

/**
 * Database controller for the user collection in GalacticEd
 */
export class UserMongoService {
  /**
   * Create a new user in GalacticEd
   */
  public async createUser(user: CreateUserInput): Promise<User> {
    try {
      const createUserResponse = (await UserModel.create({
        ...user,
        activeChildId: '',
      })) as User;
      return createUserResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a child in GalacticEd
   */
  public async createChild(
    child: CreateChildInput,
    parentId: string
  ): Promise<Child> {
    try {
      const createChildResponse = (await ChildModel.create({
        ...child,
      })) as Child;
      await UserModel.updateOne(
        { _id: parentId },
        {
          $push: {
            childrenIds: createChildResponse._id,
          },
          activeChildId: createChildResponse._id,
        }
      );
      return createChildResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update the details of a user in GalacticEd
   */
  public async updateUser(user: Partial<UpdateUserInput>): Promise<User> {
    try {
      await UserModel.updateOne({ _id: user._id }, user);
      const updatedUser = await this.getUserById(user._id);
      return updatedUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update the profile of a child in GalacticEd
   */
  public async updateChild(child: Partial<UpdateChildInput>): Promise<Child> {
    try {
      checkObjectIdIsValid(child._id);
      const updateResult = await ChildModel.updateOne(
        { _id: child._id },
        child
      );
      if (!updateResult)
        throw new Error(`Couldn't update child with ID: '${child._id}'`);
      const newChild = (await ChildModel.findById(child._id)) as Child;
      return newChild;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a user from GalacticEd (by id)
   */
  public async deleteUser(id: string): Promise<string> {
    try {
      const childrenIds = (await this.getUserById(id)).childrenIds;
      await UserModel.deleteOne({ _id: id });
      for (let childrenId of childrenIds) {
        await ChildModel.deleteOne({ _id: childrenId });
      }
      return `Successfully deleted user with id ${id}, and their child ids ${childrenIds.join(
        ', '
      )}!`;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Retrieve the details of a user from GalacticEd, by id
   */
  public async getUserById(id: string): Promise<User> {
    try {
      checkObjectIdIsValid(id);
      const userResponse = (await UserModel.findById(id)) as User;
      return userResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Retrieve the details of a child from GalacticEd, by id
   */
  public async getChildById(id: string): Promise<Child> {
    try {
      checkObjectIdIsValid(id);
      const childResponse = (await ChildModel.findById(id)) as Child;
      if (!childResponse)
        throw new Error(`Couldn't find the child with ID: ${id}`);
      return childResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getChildrenById(ids: string[]): Promise<Child[]> {
    try {
      ids.forEach((id) => checkObjectIdIsValid(id));
      const children = (await ChildModel.find({
        _id: { $in: ids },
      })) as Child[];
      return children;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get the details of all users in GalacticEd
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      const users = (await UserModel.find({})) as User[];
      return users;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getAllChildren(): Promise<Child[]> {
    try {
      const children = (await ChildModel.find({})) as Child[];
      return children;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get the details of a user by username
   */
  public async getUserByUsername(username: string): Promise<User> {
    try {
      const user = (await UserModel.findOne({ username: username })) as User;
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get the details of a user by email
   */
  public async getUserByEmail(email: string): Promise<User> {
    try {
      const user = (await UserModel.findOne({ email: email })) as User;
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
