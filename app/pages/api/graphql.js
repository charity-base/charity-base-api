import { ApolloServer } from "apollo-server-micro"
import schema from "graphql-schema"

const apolloServer = new ApolloServer({
  schema,
  playground: false,
  introspection: true,
  context: ({ req }) => ({ req }),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: "/api/graphql" })
