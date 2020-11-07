import React , { useState } from "react"
import { useMutation , useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { TodayRounded } from "@material-ui/icons";

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
`;
const deleteTodo = gql`
  mutation delTask($id: ID!){
    delTask(id : $id){
      text
    }
  }
`

export default function Home() {
  
  const [todo , setTodo] = useState('')
  const { loading , error , data } = useQuery(getTodos)
  const [deleteTask] = useMutation(deleteTodo);
  const [addTask] = useMutation(addTodo);
console.log(data);

  if(error){
    console.log(error);
    
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (todo !== "") {
      addTask({
        variables: {
          text: todo,
        },
        refetchQueries: [{ query: getTodos }],
      });
      setTodo("");
    }
  };

  const handleDelete = (event) => {
      console.log(JSON.stringify(event.currentTarget.value));
      deleteTask({
        variables: {
          id: event.currentTarget.value,
        },
        refetchQueries: [{ query: getTodos }],
      });
  }
  return( 
    <div>
      <div>
        TODO APP
      </div>
      <div>
      <>
        <input type='text' placeholder='type todo' onChange={(e) => setTodo(e.currentTarget.value)} required/>
        <button type='submit' onClick={handleSubmit}>+</button>
      </>
      </div>
      <div>
        {loading ? <h4>loading</h4> : (
          <div>
            {data.allTask.map((v , i) => (
              <div key={i}>
                <h5>{v.text}</h5>
                <button value={v.id} onClick={handleDelete}>x</button>
              </div>
            ))}
          </div>
        )} 
      </div>
    </div>
  )
}
