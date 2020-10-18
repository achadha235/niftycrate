import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  type User {
    id: String!
    ethAddress: String!
    firstName: String
    lastName: String
    profileImageUrl: String
  }

  type Query {
    user(id: String!): User
  }

  type Mutation {
    login(ethAddress: String!, signup: Boolean!): User
  }
`;

export default typeDefs;
