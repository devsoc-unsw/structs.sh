import gql from 'graphql-tag';

export const builderTypeDefs = gql`
  type Image {
    url: String
  }

  input ImageSearchOptions {
    "Whether to prefer images with a white background in the image search query"
    preferWhiteBackground: Boolean
  }
`;
