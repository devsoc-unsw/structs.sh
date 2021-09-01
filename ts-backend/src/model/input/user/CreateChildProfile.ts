import { Child } from 'src/model/user/Child';

/** Interface for the input required for updating a user profile. */
export interface CreateChildProfile extends Child {
  threeDimensional: boolean;
  avatar: string;
  avatarColor: string;
}
