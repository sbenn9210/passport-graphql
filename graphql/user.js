require("dotenv").config();
const { gql } = require("apollo-server-express");
const bcrypt = require("bcrypt");

const { User } = require("../src/db/models");

const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User
  }

  type Query {
    current: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    register(name: String!, email: String!, password: String!): AuthPayload
  }
`;

const resolvers = {
  Query: {
    async current(_, args, { res }) {
      if (!res.userId) {
        return null;
      }
      return await User.findOne({ where: { id: res.userId } });
    },
  },
  Mutation: {
    register: async (parent, { name, email, password }, context) => {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new Error("Email already exists.");
      }
      const newUser = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });

      context.User = newUser;
      await context.login(newUser);
      return { user: newUser };
    },
    login: async (parent, { email, password }, context) => {
      const matchingUser = await User.findOne({ where: { email } });
      if (!matchingUser) {
        throw new Error("This email doesn't exist");
      }
      const validPassword = await bcrypt.compare(
        password,
        matchingUser.password
      );
      if (!validPassword) {
        throw new Error("Your password is incorrect");
      }
      const { user } = await context.authenticate("graphql-local", {
        email,
        password,
      });
      await context.login(user);
      return { user };
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
