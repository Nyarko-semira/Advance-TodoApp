import React from 'react'
import Todo from './Component/Todo/Todo'
import './Component/App.css'
import {ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className='App'>
      <Todo/>
      <ToastContainer />
    </div>
  )
}

export default App

