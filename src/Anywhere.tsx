import React from 'react';
import './Anywhere.css';
import { Routes, Route} from 'react-router-dom';
import Main from './views/Main';



function Anywhere() {
  return (
    <Routes>
    <Route index element={<Main />} />
  </Routes>
  );
}

export default Anywhere;
