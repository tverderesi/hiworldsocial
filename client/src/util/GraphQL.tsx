import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      profilePicture
      comments {
        id
        createdAt
        username
        body
      }
      likes {
        id
        createdAt
        username
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      comments {
        id
        createdAt
        username
        body
        profilePicture
      }
      likes {
        id
        createdAt
        profilePicture
      }
      profilePicture
    }
  }
`;

export const LOGIN_USER = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      token
      username
      createdAt
      profilePicture
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($registerInput: RegisterInput) {
    register(registerInput: $registerInput) {
      username
      password
      email
      createdAt
      profilePicture
      token
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($PostId: ID!) {
    likePost(postId: $PostId) {
      id
      likes {
        id
        username
        profilePicture
      }
      likeCount
    }
  }
`;

export const GET_LIKE_COUNT = gql`
  query GetPost($PostId2: ID!) {
    getPost(postId: $PostId) {
      likeCount
    }
  }
`;

export const GET_POST = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      profilePicture
      comments {
        id
        username
        createdAt
        body
        profilePicture
      }
      likes {
        id
        createdAt
        username
        profilePicture
      }
      likeCount
      commentCount
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      comments {
        id
        username
        createdAt
        body
      }
      likes {
        id
        createdAt
        username
        profilePicture
      }
      likeCount
      commentCount
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($postId: String!, $commentId: String!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      createdAt
      username
      profilePicture
      comments {
        id
        username
        createdAt
        body
        profilePicture
      }
      likes {
        id
        createdAt
        username
        profilePicture
      }
      likeCount
      commentCount
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($username: String!) {
    getUser(username: $username) {
      username
      password
      email
      createdAt
      profilePicture
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser(
    $id: ID!
    $username: String!
    $email: String!
    $profilePicture: String!
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      profilePicture: $profilePicture
    ) {
      id
      username
      email
      createdAt
      profilePicture
    }
  }
`;
