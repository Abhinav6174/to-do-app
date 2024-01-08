import React,{useEffect, useState} from 'react'
import './App.css'
import { MdDeleteOutline, MdCheck, MdEdit } from "react-icons/md" 

const App = () => {
  const[isCompleteScreen, setIsCompleteScreen] = useState(false)
  const[allTodos, setAllTodos] = useState([])
  const[newTitle, setNewTitle] = useState("")
  const[newDescription, setNewDescription] = useState("")
  const[CompletedTodos, setCompletedTodos] = useState([])
  const[editMode, setEditMode] = useState(false) 
  const[editedIndex, setEditedIndex] = useState(null) 
  const isAddButtonDisabled = !newTitle.trim() || !newDescription.trim() 

  //Adds Todo
  const addTodoHandle = () => {
    let updatedTodoArray 
  
    if (editMode && editedIndex !== null) {
      // Editing existing Todo
      updatedTodoArray = [...allTodos] 
      updatedTodoArray[editedIndex] = {
        title: newTitle,
        description: newDescription,
      } 
      setEditMode(false) 
      setEditedIndex(null) 
    } 
    else {
      // Adding new Todo
      const newTodoItem = {
        title: newTitle,
        description: newDescription,
      } 
      updatedTodoArray = [...allTodos, newTodoItem] 
    }
    setAllTodos(updatedTodoArray) 
    localStorage.setItem('todoList', JSON.stringify(updatedTodoArray)) 
  
    setNewTitle('') 
    setNewDescription('') 
  } 

  // edit specific Todo
  const editTodoHandle = (index) => {
    setEditMode(true) 
    setEditedIndex(index) 
    setNewTitle(allTodos[index].title) 
    setNewDescription(allTodos[index].description) 
  } 

  // Deletes Todo
  const deleteTodoHandle = (index, showConfirmation = true) => {
    if (showConfirmation) {
      const confirmDeletion = window.confirm('Are you sure you want to delete this todo?') 
      if (!confirmDeletion) {
        return 
      }
    }

    let deletedTodoArray = [...allTodos] 
    deletedTodoArray.splice(index, 1) 
    setAllTodos(deletedTodoArray) 
    localStorage.setItem('todoList', JSON.stringify(deletedTodoArray)) 
  }

  // Adds completed todo to completed tab
  const completedTodoHandle = (index) => {
    const confirmCompletion = window.confirm('Mark this todo as completed?')
    if (confirmCompletion) {
      let filteredItem = {
        ...allTodos[index]
      }

      let completedTodoArray = [...CompletedTodos] 
      completedTodoArray.push(filteredItem) 
      setCompletedTodos(completedTodoArray) 
      // Delete item from the actual todo list without confirmation
      deleteTodoHandle(index, false) 
      localStorage.setItem('completedTodoList', JSON.stringify(completedTodoArray))
    }
  }
  
  //Deletes Completed Todos
  const deleteCompletedTodoHandle = (index) =>{
    const confirmDeletion = window.confirm('Are you sure you want to delete this Completed Todo?') 
    if (confirmDeletion) {
      let deleteCompletedTodoArray = [...CompletedTodos]
      deleteCompletedTodoArray.splice(index, 1)
      setCompletedTodos(deleteCompletedTodoArray)
      localStorage.setItem('completedTodoList', JSON.stringify(deleteCompletedTodoArray))
    }
  }

  //using useEffect hook whenever the page is rendered 1st and checking whether local storage contains item or not
  //session storage
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
            <label>Title: </label>
            <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='Enter Todo Title' required/>
          </div>

          <div className='todo-input-item'>
            <label>Description: </label>
            <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='Enter Todo Description' required/>
          </div>

          <div className='todo-input-itm'>
            <button type='button' onClick={addTodoHandle} className='addbtn' disabled={isAddButtonDisabled}>Add Todo</button>
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
                  <h3 className='todo-input-item-text'>{item.title}</h3>
                  <p className='todo-input-item-text'>{item.description}</p>
                </div>
                <div>
                  <MdDeleteOutline className='icons' onClick={() => deleteTodoHandle(index)} title='Delete' />
                  <MdCheck className='icons' onClick={() => completedTodoHandle(index)} title='Complete'/>
                  <MdEdit className='icons' onClick={() => editTodoHandle(index)} title='Edit' />
                </div>
              </div>
            )
          })}

          {isCompleteScreen === true && CompletedTodos.map((item, index) =>{
            return(
              <div className='todo-list-item' key={index}>
                <div>
                  <h3 className='todo-input-item-text'>{item.title}</h3>
                  <p className='todo-input-item-text'>{item.description}</p>
                </div>
                <div>
                  <MdDeleteOutline className='icons' onClick={() => deleteCompletedTodoHandle(index)} title='Delete?' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
