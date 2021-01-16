const express = require("express");
const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");

// const User = require("./User");
const { User } = require("./src/db/models");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const { typeDefs, resolvers } = require("./graphql/user");

const PORT = 4000;

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const matchingUser = await User.findOne({ where: { email } });
    if (!matchingUser) {
      return done(null, false, { message: "Incorrect username" });
    }
    const validPassword = await bcrypt.compare(password, matchingUser.password);
    if (!validPassword) {
      return done(null, false, { message: "Incorrect password" });
    }

    const error = matchingUser ? null : new Error("no matching user");
    return done(error, matchingUser);
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.findByPk(id);
  return done(null, user);
});

const app = express();

app.use(
  session({
    genid: (req) => uuid(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  playground: {
    endpoint: "/graphql",
  },
  context: ({ req, res }) => buildContext({ req, res, User }),
});

server.applyMiddleware({ app, cors: false });

app.listen(PORT, () => {
  console.log(`The server is listening on ${PORT}/graphql`);
});
