import React , { useState } from "react"
import { useMutation , useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const getTodos = gql`
  {
    allTask {
      id
      text
    }
  }
`
const addTodo = gql`
  mutation addTask($text: String!){
    addTask(text : $text)
  }
`

export default function Home() {
  const [todo , setTodo] = useState('')
  return( 
    <div>
      <div>
        <input type='text' placeholder='type todo' onChange={(e) => setTodo(e.currentTarget.value)} />
        <button>+</button>
      </div>
    </div>
  )
}
