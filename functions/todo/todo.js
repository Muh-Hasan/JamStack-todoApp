const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
q = faunadb.query

require("dotenv").config()

const typDefs = gql`
  type Query {
    allTask: [Task]
  }
  type Mutation {
    addTask(text: String): Task
    delTask(id: ID!): Task
  }
  type Task {
    id: ID!
    text: String!
  }
`
const client = new faunadb.Client({
  secret: process.env.DB_SECRET,
})

const resolvers = {
  Query: {
    allTask: async () => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("todos"))),
            q.Lambda(x => q.Get(x))
          )
        )
        const data = result.map(t => {
          return {
            id: t.ref.id,
            text: t.data.text,
          }
        })
        return data
      } catch (error) {
        console.log(error)
        return error.toString()
      }
    },
  },

  Mutation: {
    addTask: async (_, { text }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("todo"), { data: { text: text } })
        )
        return result.data
      } catch (error) {
        return error.toString()
      }
    },
    delTask: async (_, { id }) => {
      try {
        const newId = JSON.stringify(id)
        console.log(newId)
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("todos"), id))
        )
        return result.data
      } catch (error) {
        return error
      }
    },
  },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
