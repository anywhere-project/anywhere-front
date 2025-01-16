import { useSignInUserStore } from 'stores';
import './style.css';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import {  Review } from 'types';
import { ACCESS_TOKEN } from '../../constants';
import { useParams } from 'react-router-dom';
import { ResponseDto } from 'apis/dto/response';
import useReviewPagination from 'hooks/review.pagination.hook';
import GetReviewPostListResponseDto from 'apis/dto/response/review/get-review-list.response.dto';
import axios from 'axios';
import { getRecommendPostListRequest,  getReviewListRequest } from 'apis';
import GetRecommendPostListResponseDto from './../../apis/dto/response/recommend/get-recommend-post-list.response.dto';
import ReviewsIcon from '@mui/icons-material/Reviews';
import RecommendIcon from '@mui/icons-material/Recommend';

// interface: another user 정보 //
interface AnotherUser {
    userId: string;
    password: string;
    name: string;
    telNumber: string;
    nickname: string;
    profileImage: string;
    isAdmin: boolean;
    userStatus: string;
    }
export default function Mypage () {
    // state: 페이징 관련 상태 //
    const { currentPage, totalPage,  viewList, setTotalList, initViewList, ...paginationProps } = useReviewPagination<Review>();

    // state: 로그인 유저 정보 //
    const { signInUser } = useSignInUserStore();
    const [user, setUser] = useState<AnotherUser | null>(null);
    const { userId } = useParams<{ userId: string }>();
    const [profileImage, setProfileImage] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [reviewPostCount, setReviewPostCount] = useState<number>(0);
    const [recommendPostCount, setRecommendPostCount] = useState<number>(0);
    const [recommendAttractionPostCount, setRecommendAttractionPostCount] = useState<number>(0);
    const [recommendFoodPostCount, setRecommendFoodPostCount] = useState<number>(0);
    const [recommendMissionPostCount, setRecommendMissionPostCount] = useState<number>(0);


    // state: cookie 상태 //
    const [cookies] = useCookies();

    // variable: accessToken
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 내 후기 게시판 목록 상태 //
    const [reviewContents, setReviewContents] = useState<Review[]>([]);

    const [activeBoard, setActiveBoard] = useState<'review' | 'recommend'>('review');

    const handleBoardClick = (board: 'review' | 'recommend')=> {
        setActiveBoard(board);
    }

    // variable: 작성자 여부 //
    const isOwner = (signInUser?.userId === userId) ? signInUser : user;

    const imageList = [
        'https://via.placeholder.com/150', // 이미지 주소 1
        'https://via.placeholder.com/150', // 이미지 주소 2
        'https://via.placeholder.com/150', // 이미지 주소 3
        'https://via.placeholder.com/150', // 이미지 주소 4
        'https://via.placeholder.com/150', // 이미지 주소 5
        'https://via.placeholder.com/150', // 이미지 주소 6
        'https://via.placeholder.com/150', // 이미지 주소 7
        'https://via.placeholder.com/150', // 이미지 주소 8
        'https://via.placeholder.com/150'  // 이미지 주소 9
    ];

    // function : get review attraction list response 처리 함수 //
    const getReviewListResponse = (responseBody: GetReviewPostListResponseDto | ResponseDto | null ) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody!== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const reviewPosts = (responseBody as GetReviewPostListResponseDto).reviewPosts || [];

        const myReviewPosts = reviewPosts.filter(post => post.reviewWriter === userId);

        setTotalList(myReviewPosts);
        setReviewContents(myReviewPosts);

        setReviewPostCount(myReviewPosts.length);


    };

        // function : get recommend attraction list response 처리 함수 //
        const getRecommendAttractionListResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null ) => {
            const message = !responseBody ? '서버에 문제가 있습니다.' :
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
            const isSuccessed = responseBody!== null && responseBody.code === 'SU';
            if (!isSuccessed) {
                alert(message);
                return;
            }
    
            const recommendAttractionPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
            const myRecommendAttractionPosts = recommendAttractionPosts.filter(post => post.recommendWriter === userId);

            setRecommendAttractionPostCount(myRecommendAttractionPosts.length);
        };

    // function : get recommend food list response 처리 함수 //
    const getRecommendFoodListResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null ) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody!== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

    
        const recommendFoodPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
        const myRecommendFoodPosts = recommendFoodPosts.filter(post => post.recommendWriter === userId);

        setRecommendFoodPostCount(myRecommendFoodPosts.length);
        
    };


    // function : get recommend mission list response 처리 함수 //
    const getRecommendMissionListResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null ) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody!== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

    
        const recommendMissionPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
        const myRecommendMissionPosts = recommendMissionPosts.filter(post => post.recommendWriter === userId);

        setRecommendMissionPostCount(myRecommendMissionPosts.length);


    };



    // 유저 정보 가져오기
useEffect(() => {
    const fetchUserInfo = async () => {
        if (!userId) return; // userId가 없으면 종료

        try {
            const response = await axios.get(`http://localhost:4000/api/v1/mypage/${userId}`);
            const { nickname } = response.data; // 서버 응답에서 nickname 추출
            const { profileImage } = response.data;
            setNickname(nickname);
            setProfileImage(profileImage);
        } catch (error) {
            console.error('유저 정보를 가져오는 중 오류 발생:', error);
            setNickname('유저 정보를 불러오지 못했습니다.');
        }
    };

    fetchUserInfo();
}, [userId]);



useEffect(() => {
    getReviewListRequest().then(getReviewListResponse);
},[signInUser]);

useEffect(() => {
    getRecommendPostListRequest("attraction").then(getRecommendAttractionListResponse);
    getRecommendPostListRequest("food").then(getRecommendFoodListResponse);
    getRecommendPostListRequest("mission").then(getRecommendMissionListResponse);
    
},[recommendPostCount]);

useEffect(()=>{
    setRecommendPostCount(recommendAttractionPostCount+recommendFoodPostCount+recommendMissionPostCount);
},[recommendAttractionPostCount,recommendFoodPostCount,recommendMissionPostCount])



    return (

        <div id='mypage-wrapper'>
            <div className='mypage'>
                <div className='mypage-container'>
                    <div className='mypage-top'>
                    <div className='mypage-nickname'>{nickname || '닉네임 없음'}</div>

                        <div className='mypage-tool'>설정</div>
                    </div>
                    <div className='mypage-middle'>
                        <div className='mypage-profile'  style={{ backgroundImage: `url(${userId ? profileImage : '이미지 없음'})`}}></div>
                        <div className='mypage-board'>
                            <div className='board-category'>
                                <div className='board-category-count'>
                                    <div>후기 게시판</div>
                                    <div>{reviewPostCount}개</div>
                                </div>
                                <div className='board-category-count'>
                                <div>추천 게시판</div>
                                <div>{recommendPostCount}개</div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="board-selector">
                        <div
                            className={`review-board ${activeBoard === 'review' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('review')}
                        >
                            <ReviewsIcon />후기
                        </div>
                        <div
                            className={`recommend-board ${activeBoard === 'recommend' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('recommend')}
                        >
                            <RecommendIcon />추천
                        </div>
                    </div>
                    <div className="gallery-review" style={{ display: activeBoard === 'review' ? 'grid' : 'none' }}>
                        {reviewContents.map((post, index) => (
                            <div key={index} className="gallery-item">
                                <img
                                    src={post.imageUrl?.[0]?.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={`Review item ${index + 1}`}
                                    className="gallery-image"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="gallery-recommend" style={{ display: activeBoard === 'recommend' ? 'grid' : 'none' }}>
                        {imageList.map((image, index) => (
                            <div key={index} className="gallery-item">
                                <img src={image} alt={`Recommend item ${index + 1}`} className="gallery-image" />
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    )
}