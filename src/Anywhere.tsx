import React from 'react';
import './Anywhere.css';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import Main from './views/Main';
import { MYPAGE_PATH, RECOMMEND_CATEGORY_PATH, RECOMMEND_UPDATE_PATH, RECOMMEND_WRITE_PATH, REVIEW_WRITE_PATH, ROOT_PATH, SIGN_UP_PATH } from './constants';
import SignUp from './views/Auth';
import RecommendWrite from './views/Recommend/Write';
import RecommendUpdate from './views/Recommend/Update';
import Mypage from './views/Mypage';
import Recommend from 'views/Recommend';
import SideBar from 'views/SideBar';
import NavigationBar from 'views/NavigationBar';
import HashTagBar from 'views/HashTagBar';
import ReviewWrite from 'views/Review/Write';
import ReviewList from 'views/Review';

function Anywhere() {

  const location = useLocation();

  const { recommendId } = useParams();

  const showSideBar = location.pathname !== ROOT_PATH;

  const showHashTagBar = 
    !location.pathname.includes(RECOMMEND_UPDATE_PATH('')) &&
    location.pathname !== RECOMMEND_WRITE_PATH && location.pathname !== REVIEW_WRITE_PATH &&
    !location.pathname.includes(MYPAGE_PATH('')) && 
    location.pathname !== ROOT_PATH;
  
  return (
    <>
      {/* {showSideBar && <SideBar />} */}
      {showHashTagBar && <HashTagBar />}
      <NavigationBar />
      <Routes>
        <Route index element={<Main />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={RECOMMEND_CATEGORY_PATH(':category')} element={<Recommend />} />
        <Route path={RECOMMEND_WRITE_PATH} element={<RecommendWrite />} />
        <Route path={RECOMMEND_UPDATE_PATH(':recommendId')} element={<RecommendUpdate />} />
        <Route path={MYPAGE_PATH(':userId')} element={<Mypage />} />
        <Route path={REVIEW_PATH} element={<ReviewList/>}/>
        <Route path={REVIEW_WRITE_PATH} element={<ReviewWrite/>}/>
      </Routes>
    </>
  );
}

export default Anywhere;
