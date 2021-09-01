import gql from 'graphql-tag';

export const componentTypeDefs = gql`
  type Component {
    "The type of component from GalacticEd's library - stringified."
    componentData: String
  }

  input CreateComponentInput {
    "The type of component from GalacticEd's library"
    componentData: String
  }
`;
