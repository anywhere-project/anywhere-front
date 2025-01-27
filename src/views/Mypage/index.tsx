import { useSignInUserStore } from 'stores';
import './style.css';
import { useCookies } from 'react-cookie';

import { useEffect, useRef, useState } from 'react';
import { RecommendAttraction, RecommendPost, MyRandom, Review, RecommendMission, RecommendFood } from 'types';
import { ACCESS_TOKEN, MYPAGE_UPDATE_PATH, RECOMMEND_UPDATE_PATH, REVIEW_UPDATE_PATH } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponseDto } from 'apis/dto/response';
import GetReviewPostListResponseDto from 'apis/dto/response/review/get-review-list.response.dto';
import axios from 'axios';
import { deleteRecommendPostRequest, deleteReviewPostRequest, getRecommendAttractionListRequest, getRecommendPostListRequest, getReviewListRequest, getMyRandomListRequest, deleteMyRandomRequest, getUserInfoRequest } from 'apis';
import GetRecommendPostListResponseDto from './../../apis/dto/response/recommend/get-recommend-post-list.response.dto';
import ReviewsIcon from '@mui/icons-material/Reviews';
import RecommendIcon from '@mui/icons-material/Recommend';
import CasinoIcon from '@mui/icons-material/Casino';
import RouletteAdd from 'views/RouletteAdd';
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto } from 'apis/dto/response/recommend';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import GetRouletteListResponseDto from './../../apis/dto/response/roulette/get-roulette-list.response.dto';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TaskIcon from '@mui/icons-material/Task';
import RouletteDel from 'views/RouletteDel';


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


interface Attractions {
    recommendAttraction: RecommendAttraction;
}

interface Missions {
    recommendMission: RecommendMission;
}

interface Foods {
    recommendFood: RecommendFood;
}


function AttractionRow({ recommendAttraction }: Attractions) {
    const [attractionImages, setAttractionImages] = useState<string[]>([]);

    useEffect(() => {
        setAttractionImages(recommendAttraction.images.map((image) => image.imageUrl));
    }, [recommendAttraction]);

    return (

        <div className="gallery-image">
            {attractionImages.map((imageUrl, index) => (
                <img src={imageUrl} alt={`Attraction ${index}`} />
            ))}
        </div>

    );
}

function FoodRow({ recommendFood }: Foods) {
    const [foodImages, setFoodImages] = useState<string[]>([]);


    useEffect(() => {
        setFoodImages(recommendFood.images.map((image) => image.imageUrl));
    }, [recommendFood]);

    return (
        <div className="food-box">
            <div className="food-image">
                {foodImages.map((imageUrl, index) => (
                    <img src={imageUrl} alt={`Food ${index}`} />
                ))}
            </div>

        </div>
    );
}

function MissionRow({ recommendMission }: Missions) {
    const [missionImages, setMissionImages] = useState<string[]>([]);

    useEffect(() => {
        setMissionImages(recommendMission.images.map((image) => image.imageUrl));
    }, [recommendMission]);

    return (
        <div className="mission-box">
            <div className="mission-image">
                {missionImages.map((imageUrl, index) => (
                    <img src={imageUrl} alt={`Mission ${index}`} />
                ))}
            </div>
        </div>
    );
}



export default function Mypage() {
    //function: 네비게이터 함수 //
    const navigator = useNavigate();

    // state: 로그인 유저 정보 //
    const { signInUser } = useSignInUserStore();

    const { userId } = useParams<{ userId: string }>();
    const [profileImage, setProfileImage] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [reviewPostCount, setReviewPostCount] = useState<number>(0);
    const [recommendPostCount, setRecommendPostCount] = useState<number>(0);
    const [rouletteCount, setRouletteCount] = useState<number>(0);
    const [recommendAttractionPostCount, setRecommendAttractionPostCount] = useState<number>(0);
    const [recommendFoodPostCount, setRecommendFoodPostCount] = useState<number>(0);
    const [recommendMissionPostCount, setRecommendMissionPostCount] = useState<number>(0);
    const [filterRecommendContents, setFilteredRecommendContents] = useState<RecommendAttraction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [selectedPost, setSelectedPost] = useState<Review | null>(null);
    const [myRandomList, setMyRandomList] = useState<MyRandom[]>([]);


    // state: cookie 상태 //
    const [cookies] = useCookies();

    // variable: accessToken
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 내 게시판 목록 상태 //
    const [reviewContents, setReviewContents] = useState<Review[] | null>([]);
    const [recommendAttractionContents, setRecommendAttractionContents] = useState<RecommendAttraction[]>([]);

    const [recommendPost, setRecommendPost] = useState<RecommendPost[]>([]);

    const [posts, setPosts] = useState<RecommendPost[]>([]);
    const [attractions, setAttractions] = useState<RecommendAttraction[]>([]);
    const [foods, setFoods] = useState<RecommendFood[]>([]);
    const [missions, setMissions] = useState<RecommendMission[]>([]);

    const [visiblePosts, setVisiblePosts] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const observerRef = useRef(null);

    const [activeBoard, setActiveBoard] = useState<'review' | 'recommend' | 'roulette'>('review');

    const [activeGallery, setActiveGallery] = useState<'attraction' | 'food' | 'mission'>('attraction');

    const [recommendContents, setRecommendContents] = useState<RecommendPost[]>([]);
    const [activeButton, setActiveButton] = useState<'add' | 'delete' | null>(null);


    const handleBoardClick = (board: 'review' | 'recommend' | 'roulette') => {
        setActiveBoard(board);
    }

    // variable: 작성자 여부 //

    const isOwner = signInUser?.userId === userId;

    // function : get review  list response 처리 함수 //
    const getReviewListResponse = (responseBody: GetReviewPostListResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';


        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const reviewPosts = (responseBody as GetReviewPostListResponseDto).reviewPosts || [];

        const myReviewPosts = reviewPosts.filter(post => post.reviewWriter === userId);

        setReviewContents(myReviewPosts);

        setReviewPostCount(myReviewPosts.length);

        if (reviewContents === null) return;
    };



    // function : get recommend post list response 처리 함수 //
    const getRecommendAttractionResponse = (responseBody: GetRecommendAttractionListResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }

        const recommendPosts = (responseBody as GetRecommendAttractionListResponseDto).attractions || [];

        setRecommendAttractionContents(recommendPosts);
    };

    // function : get recommend post list response 처리 함수 //
    const getRecommendListResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }

        const recommendPosts2 = (responseBody as GetRecommendPostListResponseDto).posts || [];

        setRecommendPost(recommendPosts2);
        setPosts(recommendPosts2);

    };


    const filterMatchingRecommendIds = () => {
        const matchingContents = recommendAttractionContents.filter(attraction => {
            // recommendContents에서 matching recommendId 찾기
            return recommendContents.some(post => post.recommendId === attraction.recommendId);
        });
        return matchingContents;
    };



    const getRecommendAttractionListResponse = (responseBody: GetRecommendAttractionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        if ('attractions' in responseBody) {
            const { attractions } = responseBody;
            setAttractions(attractions);
        } else {
            console.error('responseBody에 attractions 속성이 없습니다.', responseBody);
        }
        const { attractions } = responseBody as GetRecommendAttractionPostResponseDto;
        setAttractions(attractions);
    }

    const getRecommendFoodListResponse = (responseBody: GetRecommendFoodListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { foods } = responseBody as GetRecommendFoodListResponseDto;
        setFoods(foods);
    }

    const getRecommendMissionListResponse = (responseBody: GetRecommendMissionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { missions } = responseBody as GetRecommendMissionListResponseDto;
        setMissions(missions);
    }

    // function : get recommend attraction list response 처리 함수 //
    const getRecommendAttractionCountResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';


        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const recommendAttractionPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
        const myRecommendAttractionPosts = recommendAttractionPosts.filter(post => post.recommendWriter === userId);
        setRecommendAttractionPostCount(myRecommendAttractionPosts.length);
    };

    // function : get recommend food list response 처리 함수 //


    const getRecommendFoodCountResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null) => {

        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const recommendFoodPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
        const myRecommendFoodPosts = recommendFoodPosts.filter(post => post.recommendWriter === userId);

        setRecommendFoodPostCount(myRecommendFoodPosts.length);
    };

    // function : get recommend mission list response 처리 함수 //


    const getRecommendMissionCountResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null) => {

        const message = !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const recommendMissionPosts = (responseBody as GetRecommendPostListResponseDto).posts || [];
        const myRecommendMissionPosts = recommendMissionPosts.filter(post => post.recommendWriter === userId);

        setRecommendMissionPostCount(myRecommendMissionPosts.length);
    };

    const getRecommendPostListResponse = (responseBody: GetRecommendPostListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { posts } = responseBody as GetRecommendPostListResponseDto;
        setPosts(posts);
        console.log("posts =", posts);  // 여기서 null인지 확인
        if (!posts) {
            console.warn("서버 응답에 posts가 null입니다.");
            return;
        }
    }


    const deleteMyRandomResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NMR' ? '랜덤 이력이 존재하지 않습니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 아이디입니다.' :
            responseBody.code === 'NP' ? '허가되지 않은 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const getMyRandomListResponse = (responseBody: GetRouletteListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 아이디입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { myRandoms } = responseBody as GetRouletteListResponseDto;
        setMyRandomList(myRandoms);

        const rouletteList = (responseBody as GetRouletteListResponseDto).myRandoms || [];

        const myRouletteList = rouletteList.filter(post => post.userId === userId);

        setRouletteCount(myRouletteList.length);
    }


    const reviewHandleEditPost = (post: Review) => {
        if (!post.reviewId) {
            alert("리뷰 ID를 찾을 수 없습니다.");
            return;
        }
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }
        navigator(REVIEW_UPDATE_PATH(post.reviewId));
    };


    const reviewHandleDeletePost = (post: Review) => {

        const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
        if (confirmDelete) {
            if (!post.reviewId) {
                alert("리뷰 ID를 찾을 수 없습니다.");
                return;
            }
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }
            deleteReviewPostRequest(post.reviewId, accessToken)
                .then(response => {
                    if (response.code === 'SU') {
                        alert('게시물이 성공적으로 삭제되었습니다.');
                        // 성공적으로 삭제 후 화면에서 게시물을 제거
                        setReviewContents(prev => prev ? prev.filter(item => item.reviewId !== post.reviewId) : []);
                    } else {
                        alert('게시물 삭제에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('게시물 삭제 중 오류 발생:', error);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                });
        }
    };

    const recommendHandleEditPost = (post: RecommendAttraction) => {
        if (!post.recommendId) {
            alert("추천 ID를 찾을 수 없습니다.");
            return;
        }
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }
        navigator(RECOMMEND_UPDATE_PATH(post.recommendId));
    };

    const recommendHandleDeletePost = (post: RecommendAttraction) => {
        const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
        if (confirmDelete) {
            if (!post.recommendId) {
                alert("추천 ID를 찾을 수 없습니다.");
                return;
            }
            if (!accessToken) {
                alert("로그인이 필요합니다.");
                return;
            }
            deleteRecommendPostRequest(post.recommendId, accessToken)
                .then(response => {
                    if (response.code === 'SU') {
                        alert('게시물이 성공적으로 삭제되었습니다.');
                        // 성공적으로 삭제 후 화면에서 게시물을 제거
                        setRecommendPost(prev => prev.filter(item => item.recommendId !== post.recommendId));
                    } else {
                        alert('게시물 삭제에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('게시물 삭제 중 오류 발생:', error);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                });
        }
    };
    const onClickNickname = () => {
        if (!signInUser) return;
        navigator(MYPAGE_UPDATE_PATH(signInUser.userId));
    }

    const onMyRandomDeleteClickHandler = (index: number) => {
        const randomId = myRandomList[index].randomId;
        if (!accessToken || !randomId) return;
        const isConfirm = window.confirm("정말 삭제하시겠습니까?");
        if (isConfirm) {
            deleteMyRandomRequest(index, accessToken).then(deleteMyRandomResponse);
        }
    }
    const loadMorePosts = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisiblePosts((prev) => prev + 5);
            setIsLoading(false);
        }, 1000);
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
        getRecommendAttractionListRequest().then(getRecommendAttractionResponse);
        getRecommendPostListRequest("attraction").then(getRecommendListResponse);

    }, [recommendPostCount]);


    useEffect(()=>{
        setRecommendPostCount(recommendAttractionPostCount+recommendFoodPostCount+recommendMissionPostCount);
    },[recommendAttractionPostCount,recommendFoodPostCount,recommendMissionPostCount])
    }, [recommendPostCount]);

    useEffect(() => {
        setRecommendPostCount(recommendAttractionPostCount + recommendFoodPostCount + recommendMissionPostCount);
    }, [recommendAttractionPostCount, recommendFoodPostCount, recommendMissionPostCount])

    useEffect(() => {
        getReviewListRequest().then(getReviewListResponse);

        if (accessToken) {
        getMyRandomListRequest(accessToken).then(getMyRandomListResponse);
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMorePosts();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [signInUser]);




    useEffect(() => {
        setRecommendPostCount(recommendAttractionPostCount + recommendFoodPostCount + recommendMissionPostCount);
    }, [recommendAttractionPostCount, recommendFoodPostCount, recommendMissionPostCount])


    useEffect(() => {
        // 예시로 필터링된 값을 다른 상태에 저장할 수 있음
        const filteredContents = filterMatchingRecommendIds();
        setFilteredRecommendContents(filteredContents);
    }, [activeBoard]);


    useEffect(() => {
        getRecommendPostListRequest("attraction").then(getRecommendAttractionCountResponse);
        getRecommendPostListRequest("food").then(getRecommendFoodCountResponse);
        getRecommendPostListRequest("mission").then(getRecommendMissionCountResponse);
    }, [recommendPostCount])

    useEffect(() => {
        // getRecommendPostListRequest("attractions").then(getRecommendPostListResponse);


        getRecommendAttractionListRequest().then(getRecommendAttractionListResponse);
        // getRecommendAttractionListRequest().then(getRecommendFoodListResponse);
        // getRecommendAttractionListRequest().then(getRecommendMissionListResponse);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMorePosts();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [recommendPostCount]);


    const filteredAttractions = (attractions || []).filter(attraction =>
        (posts || []).some(post => post.recommendId === attraction.recommendId)
    );



    const filteredFoods = foods.filter(food =>
        posts.some(post => post.recommendId === food.recommendId)
    );

    const filteredMissions = missions.filter(mission =>
        posts.some(post => post.recommendId === mission.recommendId)
    );


    return (
        <div id='mypage-wrapper'>
            <div className='mypage'>
                <div className='mypage-container'>
                    <div className='mypage-top'>
                        <div className='mypage-nickname' onClick={onClickNickname}>{nickname || '닉네임 없음'}<SettingsIcon /> </div>
                        <div className='mypage-tool'></div>
                    </div>
                    <div className='mypage-middle'>
                        <div className='mypage-profile' style={{ backgroundImage: `url(${userId ? profileImage : '이미지 없음'})` }}></div>
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
                                <div className='board-category-count'>
                                    <div>룰렛 기록</div>
                                    <div>{rouletteCount}개</div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {signInUser?.isAdmin && (
                        <div className="roulette-buttons">
                            <button
                                className={`roulette-button ${activeButton === 'add' ? 'active' : ''}`}
                                onClick={() =>
                                    setActiveButton((prev) => (prev === 'add' ? null : 'add'))
                                }
                            >
                                룰렛 추가
                            </button>
                            <button
                                className={`roulette-button ${activeButton === 'delete' ? 'active' : ''}`}
                                onClick={() =>
                                    setActiveButton((prev) => (prev === 'delete' ? null : 'delete'))
                                }
                            >
                                룰렛 삭제
                            </button>
                        </div>
                    )}

                    {activeButton === 'add' && <RouletteAdd />}
                    {activeButton === 'delete' && <RouletteDel />}


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
                        <div
                            className={`recommend-board ${activeBoard === 'roulette' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('roulette')}
                        >
                            <CasinoIcon />룰렛
                        </div>
                    </div>
                    {activeBoard === 'recommend' && (
                    <div className="board-selector">
                        <div
                            className={`attraction-gallery ${activeGallery === 'attraction' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('review')}
                        >
                            <AttractionsIcon />관광지
                        </div>
                        <div
                            className={`food-gallery ${activeGallery === 'food' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('recommend')}
                        >
                            <LunchDiningIcon />먹거리
                        </div>
                        <div
                            className={`mission-gallery ${activeGallery === 'mission' ? 'active' : ''}`}
                            onClick={() => handleBoardClick('roulette')}
                        >
                            <TaskIcon />미션
                        </div>
                    </div>
                    )}

                    <div className="gallery-review" style={{ display: activeBoard === 'review' ? 'grid' : 'none' }}>

                        {reviewContents?.map((post, index) => (
                            <div key={index} className="gallery-item" onClick={() => {
                                setSelectedPost(post); // 클릭한 포스트 정보를 상태에 저장
                                setIsModalOpen(true);  // 모달 열기
                            }}>
                                <div className='button-overlay'>
                                    <div className="item-buttons">
                                        <button
                                            className="item-button"
                                            onClick={() => reviewHandleEditPost(post)}
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button
                                            className="item-button"
                                            onClick={() => reviewHandleDeletePost(post)}
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </div> </div>
                                <img
                                    src={post.imageUrl?.[0]?.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={`Review item ${index + 1}`}
                                    className="gallery-image"
                                />

                            </div>
                        ))}
                    </div>
                    {/* 모달이 열릴 때만 selectedPost가 존재하면 모달을 표시 */}
                    {isModalOpen && selectedPost && (
                        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className='modal-writer'>{selectedPost.reviewWriter}</div>
                                <img
                                    src={selectedPost.imageUrl?.[0]?.imageUrl || 'https://via.placeholder.com/150'}
                                    alt="Selected post"
                                    className="modal-image"
                                />
                                <p>{selectedPost.reviewContent}</p>
                                <p>{selectedPost.reviewCreatedAt}</p>
                                <p>좋아요 : {selectedPost.reviewLikeCount}</p>

                                <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </button>
                            </div>

                        </div>
                    )}




                    <div className="gallery-recommend" style={{ display: activeBoard === 'recommend' ? 'grid' : 'none' }}>

                        {(posts || []).slice(0, visiblePosts).map((post) => {
                            const matchedAttractions = (filteredAttractions || []).filter(
                                (attraction) => attraction.recommendId === post.recommendId
                            );
                            // const matchedMissions = filteredMissions.filter(
                            //     (mission) => mission.recommendId === post.recommendId
                            // );
                            // const matchedFoods = filteredFoods.filter(
                            //     (food) => food.recommendId === post.recommendId
                            // );

                            return (
                                <div key={post.recommendId} className="gallery-item">

                                    <div className="gallery-item">
                                        {
                                            matchedAttractions.map((attraction, index) => (
                                                <AttractionRow
                                                    key={attraction.attractionId}
                                                    recommendAttraction={attraction}
                                                />
                                            ))
                                        }
                                        {matchedAttractions.length}
                                    </div>

                                    {/* <div className="mypage-recommend-mission-item">
                                            {
                                                matchedMissions.map((mission, index) => (
                                                    <MissionRow
                                                        key={mission.missionId}
                                                        recommendMission={mission}
                                                    />
                                                ))
                                            }
                                        </div>

                                        <div className="mypage-recommend-food-item">
                                            {
                                                matchedFoods.map((food, index) => (
                                                    <FoodRow
                                                        key={food.foodId}
                                                        recommendFood={food}
                                                    />
                                                ))
                                            }
                                        </div> */}
                                </div>
                            );
                        })}
                    </div>

                    {isLoading && <div className="mypage-loading-spinner">Loading...</div>}

                    <div ref={observerRef} style={{ height: "1px" }}></div>



                    <div className="gallery-recommend" style={{ display: activeBoard === 'recommend' ? 'grid' : 'none' }}>


                        {/* {filterRecommendContents.map((post, index) => (
                            <div key={index} className="gallery-item">
                                <img
                                    src={post.images?.[0]?.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={`Recommend item ${index + 1}`}
                                    className="gallery-image"
                                />

                                <div className='button-overlay'>
                                    <div className="item-buttons">
                                        <button
                                            className="item-button"
                                            onClick={() => recommendHandleEditPost(post)}
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button
                                            className="item-button"
                                            onClick={() => recommendHandleDeletePost(post)}
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))} */}

                    </div>
                    <div className="roulette-record" style={{ display: activeBoard === 'roulette' ? 'block' : 'none' }}>
                        <table className="roulette-table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>지역</th>
                                    <th>관광지</th>
                                    <th>먹거리</th>
                                    <th>미션</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myRandomList.map((myrandom, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{myrandom.areaName}</td>
                                        <td>{myrandom.attractionName}</td>
                                        <td>{myrandom.foodName}</td>
                                        <td>{myrandom.missionName}</td>
                                        <td>
                                            <IconButton
                                                className="random-delete-button"
                                                onClick={() => onMyRandomDeleteClickHandler(index)}
                                            >
                                                <Delete className='random-delete-icon' />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}