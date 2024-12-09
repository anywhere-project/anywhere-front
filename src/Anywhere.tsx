import React from 'react';
import './Anywhere.css';
import { Routes, Route } from 'react-router-dom';
import Main from './views/Main';
import { SIGN_UP_PATH } from './constants';
import SignUp from 'views/Auth';



function Anywhere() {
  return (
  <Routes>
    <Route index element={<Main />} />
    <Route path={SIGN_UP_PATH} element={<SignUp />} />
  </Routes>
  );
}

export default Anywhere;
