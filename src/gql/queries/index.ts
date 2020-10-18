import { gql } from 'apollo-boost';

export const getUserQuery = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      profileImageUrl
    }
  }
`;
