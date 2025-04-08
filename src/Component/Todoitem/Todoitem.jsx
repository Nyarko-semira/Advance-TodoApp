import React from 'react'
import { useState } from 'react';

import { useSortable } from "@dnd-kit/sortable";
import '../Todoitem/Todoitem.css'
import { FaRegCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { CSS } from "@dnd-kit/utilities";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';





const Todoitem = ({ handleEditEvent, no, display,text, deleteTodo, toggle, todo, date,  priority, handledelete  }) => {

  const getPriorityColor = () => {
    switch (priority) {
      case "High": return "red";
      case "Medium": return "orange";
      case "Low": return "green";
      default: return "gray";
    }
  };


   // Enable sorting for this item
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: no });
   const [show, setShow] = useState(false);

   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);


    const handleDelete = () =>{
      if (display === "line-through") {
        alert("You can't delete a completed task!");
        return;
      }
      handleShow();
    }



  const style = {
    transform: CSS.Transform.toString(transform), 
    transition,
    borderLeft:`5px solid ${getPriorityColor()}`
  };


   
  return (
      <>
      <div className="todoitem" style={style} ref={setNodeRef}  >
         {/* <div className="todoitem" style={{ borderLeft: `5px solid ${getPriorityColor()}` }}></div> */}
    
     <div {...listeners} {...attributes} className="drag-handle" >
        <RxDragHandleDots2 />
      </div>

        <div className={`todoitems-container ${display}`} onClick={()=>{toggle(no)}}>
          
        {display === ""?<FaRegCircle  className='circle'/>: <FaCheckCircle className='circle' /> }

      

        {todo?.no === no ? <div className="todoitems"  > {text}</div> : <div className="todoitems-text">{text}</div>}
          
        <div className='tododate'>{date}</div>
       
        
        </div>

        
        <div className='btns'>
       
        <MdEdit className="todoitems-edit" onClick={()=>handleEditEvent(no)} />
        {/* <MdEdit className='todoitems-delete' /> */}
        <MdDeleteForever className='todoitems-delete'  onClick={handleDelete}/>
      

      
        </div>
       
      </div>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete task, task deleted cant be restore</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=> deleteTodo(no)}>
           Delete Task
          </Button>
        </Modal.Footer>
      </Modal>

 

     
      
    </>
  )
}
export default Todoitem




      













