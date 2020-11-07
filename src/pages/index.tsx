import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"
import "./index.css"
import CircularProgress from "@material-ui/core/CircularProgress"

const getTodos = gql`
  {
    allTask {
      id
      text
    }
  }
`
const addTodo = gql`
  mutation addTask($text: String!) {
    addTask(text: $text) {
      text
    }
  }
`
const deleteTodo = gql`
  mutation delTask($id: ID!) {
    delTask(id: $id) {
      text
    }
  }
`

export default function Home() {
  const [todo, setTodo] = useState("")
  const { loading, error, data } = useQuery(getTodos)
  const [deleteTask] = useMutation(deleteTodo)
  const [addTask] = useMutation(addTodo)
  console.log(data)

  if (error) {
    ;<h4>Error</h4>
  }
  const handleSubmit = event => {
    event.preventDefault()
    addTask({
      variables: {
        text: todo,
      },
      refetchQueries: [{ query: getTodos }],
    })
    setTodo("")
  }

  const handleDelete = event => {
    console.log(JSON.stringify(event.currentTarget.value))
    deleteTask({
      variables: {
        id: event.currentTarget.value,
      },
      refetchQueries: [{ query: getTodos }],
    })
  }
  return (
    <div className="main">
      <div className="head">
        <h3>TODO APP</h3>
      </div>
      <div className="input-main">
        <div className="input-div">
          <input
            type="text"
            placeholder="add task"
            onChange={e => setTodo(e.currentTarget.value)}
            required
            value={todo}
          />
          <button type="submit" onClick={handleSubmit}>
            +
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : data.allTask.length >= 1 ? (
          <div className="data-display">
            <div className="data-div">
              {data.allTask.map((v, i) => (
                <div key={i}>
                  <p>{v.text}</p>
                  <button value={v.id} onClick={handleDelete}>
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-task">
            <h4>No Task for today</h4>
          </div>
        )}
      </div>
    </div>
  )
}
