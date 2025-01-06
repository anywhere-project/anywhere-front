import React from 'react';
import './Anywhere.css';
import { Routes, Route } from 'react-router-dom';
import Main from './views/Main';
import { MYPAGE_PATH, RECOMMEND_CATEGORY_PATH, RECOMMEND_UPDATE_PATH, RECOMMEND_WRITE_PATH, SIGN_UP_PATH } from './constants';
import SignUp from './views/Auth';
import RecommendWrite from './views/Recommend/Write';
import RecommendUpdate from './views/Recommend/Update';
import Mypage from './views/Mypage';
import Recommend from 'views/Recommend';
import SideBar from 'views/SideBar';
import NavigationBar from 'views/NavigationBar';
import HashTagBar from 'views/HashTagBar';

function Anywhere() {
  return (
    <>
      {/* <SideBar /> */}
      <HashTagBar />
      <NavigationBar />
      <Routes>
        <Route index element={<Main />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={RECOMMEND_CATEGORY_PATH(':category')} element={<Recommend />} />
        <Route path={RECOMMEND_WRITE_PATH} element={<RecommendWrite />} />
        <Route path={RECOMMEND_UPDATE_PATH(':recommendId')} element={<RecommendUpdate />} />
        <Route path={MYPAGE_PATH(':userId')} element={<Mypage />} />
      </Routes>
    </>
  );
}

export default Anywhere;
