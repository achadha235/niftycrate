import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type Mutation = {
  __typename?: 'Mutation';
  createStory?: Maybe<Story>;
};


export type MutationCreateStoryArgs = {
  createdFor: Scalars['String'];
  participantMessage: Scalars['String'];
  eventType: Scalars['String'];
  eventTime: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  psid: Scalars['String'];
};

export type Story = {
  __typename?: 'Story';
  owner: User;
  createdFor: Scalars['String'];
  eventType: Scalars['String'];
  createdAt: Scalars['Date'];
  eventTime: Scalars['Date'];
  status: StoryStatus;
  participantMessage?: Maybe<Scalars['String']>;
};

export enum StoryStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
  LinkSent = 'LinkSent',
  LinkViewed = 'LinkViewed'
}

export type Subscription = {
  __typename?: 'Subscription';
  userAdded: User;
};


export type User = {
  __typename?: 'User';
  psid: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  profileImageUrl: Scalars['String'];
  stories?: Maybe<Array<Maybe<Story>>>;
};

export type Video = {
  __typename?: 'Video';
  id: Scalars['String'];
  url: Scalars['String'];
  user: User;
  story: Story;
  order?: Maybe<Scalars['Int']>;
};

export type GetUserQueryVariables = Exact<{
  psid: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'psid' | 'firstName' | 'lastName' | 'profileImageUrl'>
  )> }
);


export const GetUserDocument = gql`
    query GetUser($psid: String!) {
  user(psid: $psid) {
    psid
    firstName
    lastName
    profileImageUrl
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      psid: // value for 'psid'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;