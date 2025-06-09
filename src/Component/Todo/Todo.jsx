import React from 'react'
import { useState, useEffect } from 'react';
import './Todo.css'
import Todoitem from '../Todoitem/Todoitem';
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { toast} from 'react-toastify';



const Todo = () => {

  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({
    text: "",
    no: 0,
    display: "",
    date: "",
    priority: "",
  })
  const [isEditing, setIsEditing] = useState(false);






  //  Handle Change
  const handleChange = (e) => {
    setTodo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value

    }));
  };

  //  Add Task
  const add = () => {
    const inputValue = todo.text.trim();

    if (inputValue.length < 4) {
      toast.error("text should be more than 4 letters!");
      return;
    }

    const inputDate = document.getElementById("dateInput").value;
    console.log(inputDate);

    if (!inputDate) {
      toast.error("Please set a date for the task!");
      return;
    }

    const selectPriority = document.getElementById("priority").value;

    if (!selectPriority) {
      toast.error("Please set a priority for the task!");
      return;
    }

    const Duplicate = todos.some(t => t.text.toLowerCase() === inputValue.toLowerCase());
    if (Duplicate) {
      toast.error("This task already exists!");
      return;
    }

    const AddTodos = ([...todos, { no: todos.length + 1, text: todo.text, display: '', date: todo.date, priority: todo.priority }]);
    setTodos(AddTodos);
    localStorage.setItem("todos", JSON.stringify(AddTodos));

    setTodo({ text: "", no: 0, display: "", date: "", priority: "" });
    //  setTodo("");

  };

  console.log(todos)


  // useEffect(() => {
  //   const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  //   setTodos(storedTodos)
  // }, []);


  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error("Error parsing todos:", error);
        localStorage.removeItem("todos");
      }
    }
  }, []);


  //  Edit task
  const editTodo = () => {
    const updatedTodos = todos.map((tT) =>
      tT.no === todo.no ? { ...tT, text: todo.text, date: todo.date, priority: todo.priority } : tT);

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setIsEditing(false)
    setTodo({ text: "", no: 0, date: "", priority: "" });

  };
  //  handle Edit Task
  const handleEditEvent = (no) => {
    const selectedtodo = todos?.find(x => x?.no === no);
    if (selectedtodo.display === "line-through") {
      toast.error("You cant edit completed Task!");
      return;
    }

    setTodo(selectedtodo)
    setIsEditing(true)
    console.log({ selectedtodo });


  }




  //  delete Task
  const deleteTodo = (no) => {
    const selectedtodo = todos?.find(x => x?.no === no);
    if (selectedtodo.display === "line-through") {
      toast.error("You cant Delete a Completed Task");
      return;
    }
    const data = todos.filter(todo => todo.no !== no);

    setTodos(data);
    localStorage.setItem("todos", JSON.stringify(data));


  };



  //  Toggle
  const toggle = (no) => {
    const updatedTodos = todos.map(todo =>
      todo.no === no ? { ...todo, display: todo.display === "" ? "line-through" : "" } : todo
    );

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };


  // // Claer all 
  // const clearAllTodo = (no) => {
  //   const data = todos.filter(todo => todo.no === no);
  //   setTodos(data);
  //   localStorage.setItem("todos", JSON.stringify(data));
  //   console.log("hello")
  // };

  const clearAllTodo = () => {
    setTodos([]);
    localStorage.removeItem("todos");
  };



  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.no === active.id);
    const newIndex = todos.findIndex((t) => t.no === over.id);

    const updatedTodos = (arrayMove(todos, oldIndex, newIndex));
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

  };


  const highPriorityCount = todos.filter(todo => todo.priority === "High").length;
  const mediumPriorityCount = todos.filter(todo => todo.priority === "Medium").length;
  const lowPriorityCount = todos.filter(todo => todo.priority === "Low").length;
  const CompletedTask = todos.filter(todo => todo.display === "line-through").length;
  const UncompletedTask = todos.filter(todo => todo.display === "").length;


  return (
    <div className='Todo'>
      <div className="todo-header">Todo List App</div>
      <div className="todo-addfield">
        <input type="text" placeholder='Add Your Task' className='todo-input' name='text' value={todo.text} onChange={handleChange} />
        <input type='date' className='inputdate' name='date' value={todo.date} onChange={handleChange} id="dateInput" />

        <select name="priority" value={todo.priority} onChange={handleChange} className="priority-dropdown" id="priority">
          <option value="" disabled>Set Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>

        </select>


        {isEditing ? <div onClick={() => { editTodo() }} className="todo-add-btn">UPDATE</div> : <div onClick={() => { add() }} className="todo-add-btn">ADD</div>}

      </div>

      {/* <div className="todo-list">
        {todos.map((item, index) => {
          return <Todoitem key={index} toggle={toggle} todo={todo} deleteTodo={deleteTodo} handleEditEvent={handleEditEvent} no={item.no} display={item.display} text={item.text} isEditing={isEditing}  date={item.date}/>
        })}

      </div> */}



      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={todos.map((item) => item.no)} strategy={horizontalListSortingStrategy}>
          {/* <SortableContext items={todos} strategy={verticalListSortingStrategy}> */}

          <div className="todo-list">
            {todos.map((item) => (
              <Todoitem
                handleEditEvent={handleEditEvent}
                deleteTodo={deleteTodo}
                toggle={toggle}
                no={item.no}
                display={item.display}
                text={item.text}
                date={item.date}
                priority={item.priority}
                todo={todo}


              />
            ))}
          </div>
        </SortableContext>
      </DndContext>



      <button onClick={() => { clearAllTodo() }} className="btn1">CLEAR ALL</button>
      <p className='total'>Total Number of Task :<span className='t-span'> {todos.length}</span></p>
      <p className='total2'>Number of Low priority task:<span className='t-span'>  {lowPriorityCount}</span></p>
      <p className='total3'>Number of Medium priority task:<span className='t-span'>  {mediumPriorityCount}</span></p>
      <p className='total4'>Number of High priority task:<span className='t-span'>  {highPriorityCount}</span></p>
      <p className='total5'>Number of Completed task:<span className='t-span'>  {CompletedTask}</span></p>
      <p className='total6'>Number of Uncompleted task:<span className='t-span'>  {UncompletedTask}</span></p>

    </div>
  )
}

export default Todo







