import React from 'react';
import './Anywhere.css';
import { Routes, Route } from 'react-router-dom';
import Main from './views/Main';
import { RECOMMEND_UPDATE_PATH, RECOMMEND_WRITE_PATH, SIGN_UP_PATH } from './constants';
import SignUp from './views/Auth';
import NavigationBar from './views/NavigationBar';
import RecommendWrite from './views/Recommend/Write';
import RecommendUpdate from './views/Recommend/Update';

function Anywhere() {
  return (
    <>
      <NavigationBar/>
      <Routes>
        <Route index element={<Main />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={RECOMMEND_WRITE_PATH} element={<RecommendWrite />} />
        <Route path={RECOMMEND_UPDATE_PATH(':recommendId')} element={<RecommendUpdate />} />
      </Routes>
    </>

  );
}

export default Anywhere;
