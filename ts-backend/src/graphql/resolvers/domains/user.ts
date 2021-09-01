import { CreateUserInput } from '../../../model/input/user/CreateUserInput';
import { UserMongoService } from '../../../dbHandlers/user';
import { UpdateUserInput } from '../../../model/input/user/UpdateUserInput';
import { generateToken } from '../../../utils';
import { CreateChildInput } from 'src/model/input/user/CreateChildInput';
import { UpdateChildInput } from 'src/model/input/user/UpdateChildInput';
import { Child } from 'src/model/user/Child';

const userService = new UserMongoService();

/**
 * All resolvers for the User Domain
 */
export const userResolvers = {
  Query: {
    getAllUsers: async () => {
      return await userService.getAllUsers();
    },
    getUserById: async (_, args: { id: string }) => {
      return await userService.getUserById(args.id);
    },
    getChildById: async (_, args: { id: string }) => {
      return await userService.getChildById(args.id);
    },
    getAllChildren: async () => {
      return await userService.getAllChildren();
    },
    getChildrenOfUser: async (_, args: { userId: string }) => {
      const user = await userService.getUserById(args.userId);
      return await userService.getChildrenById(user.childrenIds);
    },
  },
  Mutation: {
    createUser: async (_, args: { user: CreateUserInput }) => {
      const user = await userService.createUser(args.user);
      const token = generateToken(user);
      return token;
    },
    updateUser: async (_, args: { user: UpdateUserInput }) => {
      const user = await userService.updateUser(args.user);
      const token = generateToken(user);
      return token;
    },
    deleteUser: async (_, args: { id: string }) => {
      return await userService.deleteUser(args.id);
    },
    createChild: async (
      _,
      args: { child: CreateChildInput; parentId: string }
    ) => {
      return await userService.createChild(args.child, args.parentId);
    },
    updateChild: async (
      _,
      args: { child: UpdateChildInput }
    ): Promise<Child> => {
      return await userService.updateChild(args.child);
    },
  },
};
