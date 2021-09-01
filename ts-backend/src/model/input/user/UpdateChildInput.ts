import { Child } from 'src/model/user/Child';
import { CreateChildProfile } from './CreateChildProfile';

/** Interface for the input required for updating a user profile. */
export interface UpdateChildInput extends Child {
  _id: string;
  name: string;
  profile: CreateChildProfile;
  dob: string;
  learningProfileIds: string[];
  sessionIds: string[];
  currentSessionId: string;
  proficiencyIds: string[];
}
