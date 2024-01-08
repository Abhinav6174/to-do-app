import React,{useEffect, useState} from 'react'
import './App.css'
import { MdDeleteOutline, MdCheck } from "react-icons/md";


const App = () => {
  const[isCompleteScreen, setIsCompleteScreen] = useState(false)
  const[allTodos, setAllTodos] = useState([])
  const[newTitle, setNewTitle] = useState("")
  const[newDescription, setNewDescription] = useState("")
  const[CompletedTodos, setCompletedTodos] = useState([])

  const addTodoHandle = () =>{
    let newTodoItem = {
      title:newTitle,
      description:newDescription
    }
    let updatedTodoArray = [...allTodos]
    updatedTodoArray.push(newTodoItem)
    setAllTodos(updatedTodoArray)
    localStorage.setItem('todoList', JSON.stringify(updatedTodoArray))
    setNewTitle("")
    setNewDescription("")
  }

  const deleteTodoHandle = (index) =>{
    let deletedTodoArray = [...allTodos]
    deletedTodoArray.splice(index, 1)
    setAllTodos(deletedTodoArray)
    localStorage.setItem('todoList', JSON.stringify(deletedTodoArray))
  }


  const completedTodoHandle = (index) =>{
    let filteredItem = {
      ...allTodos[index]
    }
    let completedTodoArray = [...CompletedTodos]
    completedTodoArray.push(filteredItem)
    setCompletedTodos(completedTodoArray)
    deleteTodoHandle(index) // Delete item from actual todo list
    localStorage.setItem('completedTodoList', JSON.stringify(completedTodoArray))
  }

  
  const deleteCompletedTodoHandle = (index) =>{
    let deleteCompletedTodoArray = [...CompletedTodos]
    deleteCompletedTodoArray.splice(index, 1)
    setCompletedTodos(deleteCompletedTodoArray)
    localStorage.setItem('completedTodoList', JSON.stringify(deleteCompletedTodoArray))
  }

  //using useEffect hook whenever the page is rendered 1st and checking whether local storage contains item or not

  useEffect(() =>{
    let localTodo = JSON.parse(localStorage.getItem('todoList'))
    if(localTodo){
      setAllTodos(localTodo)
    }
    let completedLocalTodo = JSON.parse(localStorage.getItem('completedTodoList'))
    if(completedLocalTodo){
      setCompletedTodos(completedLocalTodo)
    }
  },[])

  return (
    <div>
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>

          <div className='todo-input-item'>
            <label>Title</label>
            <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='Enter Title' />
          </div>

          <div className='todo-input-item'>
            <label>Description</label>
            <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='Enter Description' />
          </div>

          <div className='todo-input-item'>
            <button type='button' onClick={addTodoHandle} className='primarybtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className={`togglebtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`togglebtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>

        <div className='todo-list'>
          {isCompleteScreen === false && allTodos.map((item, index) =>{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <MdDeleteOutline className='icon' onClick={() => deleteTodoHandle(index)} title='Delete?' />
                  <MdCheck className='check-icon' onClick={() => completedTodoHandle(index)} title='Complete?'/>
                </div>
              </div>
            )
          })}

          {isCompleteScreen === true && CompletedTodos.map((item, index) =>{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <MdDeleteOutline className='icon' onClick={() => deleteCompletedTodoHandle(index)} title='Delete?' />
                  {/* <MdCheck className='check-icon' onClick={() => completedTodoHandle(index)} title='Complete?'/> */}
                </div>
              </div>
            )
          })}












          <div className='todo-list-item'>
            <div>
              <h3>Task 1</h3>
              <p>Description</p>
            </div>
            <div>
              <MdDeleteOutline className='icon' />
              <MdCheck className='check-icon' />
            </div>
          </div>
        </div>





      </div>
    </div>
  )
}

export default App
