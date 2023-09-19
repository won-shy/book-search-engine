const { gql } = require("apollo-server-express");


const typeDefs = gql`

type User {
  _id: ID!
  username: String!
  email: String!
  password: String!
  savedBooks: [Book!]
}

type Book {
  _id: ID!
  authors: [String!]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
}

type Auth {
  token: ID!
  user: User
}


input BookInput {
  authors: [String!]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
}


  # Important for useQuery: We define our Query type to inform our entry points
  # The Query type is built-in to GraphQL, so we only need to extend it to include which kinds of information we plan to request in our application
type Query {
  getSingleUser: User
  me: User
}

  # Important for useMutation: We define our Mutation type to inform our entrypoints
type Mutation {
  createUser(username: String!, email: String!, password: String!): Auth

  login(email: String! password: String!): Auth

  saveBook(_id: ID!, bookToSave: BookInput!): User

  deleteBook(_id: ID!, bookToDelete: ID!): User
}
`;

module.exports = typeDefs;