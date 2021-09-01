import gql from 'graphql-tag';

export const userTypeDefs = gql`
  "The model for a user of GalacticEd. This will include Admin, Curator and Student (parent)."
  type User {
    "Unique identifier for a user in GalacticEd"
    _id: String
    "The permissions for a user - admin and/or curator and/or student."
    permissions: [String]
    "The username for a user. Could be email or chosen nickname."
    username: String
    "The email of a user. Important for notifications, and reports."
    email: String
    "The password of a user. Will be encrypted."
    password: String
    "The config variables stored against the user."
    config: Config
    " Array of children IDs connected to this user - perhaps as parent or a therapist."
    childrenIds: [String]
    " The active child id for this parent or therapist."
    activeChildId: String
  }

  "The user model for a child in the GalacticEd system."
  type Child {
    "Unique identifier for the child"
    _id: String
    "The name for a child. Necessary to differentiate between different children."
    name: String
    "The profile variables stored against the child"
    profile: ChildProfile
    "Date of birth for this child"
    dob: String
    "Array of IDs corresponding to different learning profile configuration settings"
    learningProfileIds: [String]
    "Array of IDs corresponding to sessions the child has been prescribed"
    sessionIds: [String]
    "Current session the child is taking"
    currentSessionId: String
    "Array of IDs corresponding to proficiency measures for each course the child has performance statistics for"
    proficiencyIds: [String]
  }

  "The profile variables stored against a child"
  type ChildProfile {
    "Toggle 3d planets on and off."
    threeDimensional: Boolean
    "Selected Avatar for the child - animal String"
    avatar: String
    "Selected color of Avatar for the child - animal String"
    avatarColor: String
  }

  "The input for a child profile"
  input CreateChildProfile {
    "Toggle 3d planets on and off."
    threeDimensional: Boolean
    "Selected Avatar for the child - animal String"
    avatar: String
    "Selected color of Avatar for the child - animal String"
    avatarColor: String
  }

  "This is all of the key config variables necessary in the User's experience in GalacticEd."
  type Config {
    "The selected theme for a user. Only relevant for non-student use. For students, will be space by default, right now."
    theme: String
    "Determines if a user wishes to stay signed in locally"
    keepSignedIn: Boolean
  }

  "This is the input model for creating config for a user"
  input CreateConfig {
    "The selected theme for a user. Only relevant for non-student use. For students, will be space by default, right now."
    theme: String
    "Determines if a user wishes to stay signed in locally"
    keepSignedIn: Boolean
  }

  "This is the input model for creating a user"
  input CreateUserInput {
    "The permissions for a user - admin and/or curator and/or student."
    permissions: [String]
    "The username for a user. Could be email or chosen nickname."
    username: String
    "The email of a user. Important for notifications, and reports."
    email: String
    "The password of a user. Will be encrypted."
    password: String
    "The config variables stored against the user."
    config: CreateConfig
  }

  "This is the input model for updating a user"
  input UpdateUserInput {
    "Unique identifier for a user in GalacticEd"
    _id: String
    "The permissions for a user - admin and/or curator and/or student."
    permissions: [String]
    "The username for a user. Could be email or chosen nickname."
    username: String
    "The email of a user. Important for notifications, and reports."
    email: String
    "The password of a user. Will be encrypted."
    password: String
    "The config variables stored against the user."
    config: CreateConfig
    " Array of children IDs connected to this user - perhaps as parent or a therapist."
    childrenIds: [String]
    " The active child id for this parent or therapist."
    activeChildId: String
  }

  "The input user model for creating a child in the GalacticEd system."
  input CreateChildInput {
    "The name for a child. Necessary to differentiate between different children."
    name: String
    "The profile variables stored against the child"
    profile: CreateChildProfile
    "Date of birth for this child"
    dob: String
  }

  "The input user model for updating a child in the GalacticEd system."
  input UpdateChildInput {
    "Unique identifier for the child"
    _id: String
    "The name for a child. Necessary to differentiate between different children."
    name: String
    "The profile variables stored against the child"
    profile: CreateChildProfile
    "Date of birth for this child"
    dob: String
    "Array of IDs corresponding to different learning profile configuration settings"
    learningProfileIds: [String]
    "Array of IDs corresponding to sessions the child has been prescribed"
    sessionIds: [String]
    "The current session the child is taking. When the session is complete, then"
    currentSessionId: String
    "Array of proficiency measures for each course the child has performance statistics for"
    proficiencyIds: [String]
  }
`;
