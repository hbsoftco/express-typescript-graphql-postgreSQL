import express from "express";
import dotenv from "dotenv";

import { ApolloServer } from "apollo-server-express";
import { getSchema } from "./graphql/schema";
import { getMyPrismaClient } from "./db";
import { IMyContext } from "./interface";
import { Redis } from "ioredis";
import session from "express-session";
import redisSession from "connect-redis";
import { isProd } from "./utils";

const main = async () => {
  dotenv.config();
  const redisClient = new Redis();
  const sessionStore = redisSession(session);
  const prisma = await getMyPrismaClient();

  const app = express();

  app.use(
    session({
      store: new sessionStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET!,
      name: "gql-api",
      resave: false,
      saveUninitialized: false,
      // store
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: isProd(),
        sameSite: "lax",
      },
    })
  );

  const schema = getSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): IMyContext => ({ req, res, prisma }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
