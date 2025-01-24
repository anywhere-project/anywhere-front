import React from 'react';
import './Anywhere.css';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import Main from './views/Main';
import { MYPAGE_PATH, RECOMMEND_CATEGORY_PATH, RECOMMEND_UPDATE_PATH, RECOMMEND_WRITE_PATH, REVIEW_PATH, REVIEW_WRITE_PATH, REVIEW_UPDATE_PATH, ROOT_PATH, SIGN_UP_PATH, MYPAGE_UPDATE_PATH } from './constants';
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
import ScrollTopButton from 'views/ScrollTopButton';
import ReviewUpdate from 'views/Review/Update';
import MyPageUpdate from 'views/Mypage/Update';

function Anywhere() {

  const location = useLocation();

  const showSideBar = 
  !location.pathname.includes(RECOMMEND_UPDATE_PATH('')) &&
  location.pathname !== RECOMMEND_WRITE_PATH && location.pathname !== REVIEW_WRITE_PATH &&
  !location.pathname.includes(MYPAGE_PATH('')) && 
  location.pathname !== ROOT_PATH;

  const showHashTagBar = 
    !location.pathname.includes(RECOMMEND_UPDATE_PATH('')) &&
    location.pathname !== RECOMMEND_WRITE_PATH && location.pathname !== REVIEW_WRITE_PATH &&
    !location.pathname.includes(MYPAGE_PATH('')) && 
    location.pathname !== ROOT_PATH;

  const showScrollButton = 
  !location.pathname.includes(RECOMMEND_UPDATE_PATH('')) &&
  location.pathname !== RECOMMEND_WRITE_PATH && location.pathname !== REVIEW_WRITE_PATH &&
  !location.pathname.includes(MYPAGE_PATH('')) && 
  location.pathname !== ROOT_PATH;
  
  return (
    <>
      {showSideBar && <SideBar />}
      {showHashTagBar && <HashTagBar />}
      {showScrollButton && <ScrollTopButton />}
      <NavigationBar />
      <Routes>
        <Route index element={<Main />} />
        <Route path={SIGN_UP_PATH} element={<SignUp />} />
        <Route path={RECOMMEND_CATEGORY_PATH(':category')} element={<Recommend />} />
        <Route path={RECOMMEND_WRITE_PATH} element={<RecommendWrite />} />
        <Route path={RECOMMEND_UPDATE_PATH(':recommendId')} element={<RecommendUpdate />} />
        <Route path={MYPAGE_PATH(':userId')} element={<Mypage />} />
        <Route path={MYPAGE_UPDATE_PATH(':userId')} element={<MyPageUpdate />} />
        <Route path={REVIEW_PATH} element={<ReviewList/>}/>
        <Route path={REVIEW_WRITE_PATH} element={<ReviewWrite/>}/>
        <Route path={REVIEW_UPDATE_PATH(':reviewId')} element={<ReviewUpdate/>}/>
      </Routes>
    </>
  );
}

export default Anywhere;
