import { getRecommendAttractionListRequest, getRecommendFoodListRequest, getRecommendMissionListRequest, getRecommendPostListRequest, getSignInRequest, getUserInfoRequest, postAttractionLikeRequest, postFoodLikeRequest, postMissionLikeRequest } from "apis";
import { ResponseDto } from "apis/dto/response";
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto, GetRecommendPostListResponseDto } from "apis/dto/response/recommend";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import GetUserInfoResponseDto from "apis/dto/response/user/get-user-info.response.dto";
import { RecommendAttraction, RecommendFood, RecommendMission, RecommendPost } from "types";
import { GetSignInResponseDto } from "apis/dto/response/auth";
import Banner from "views/Banner";
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN } from "../../constants";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import 'swiper/swiper-bundle.min.css';
import './style.css';

interface Posts {
    recommendPost: RecommendPost;
}

interface Attractions {
    recommendAttraction: RecommendAttraction;
    userId: string;
    index: number;
}

interface Missions {
    recommendMission: RecommendMission;
    userId: string;
    index: number;
}

interface Foods {
    recommendFood: RecommendFood;
    userId: string;
    index: number;
}

function PostRow({ recommendPost }: Posts) {
    const [nickname, setNicnkname] = useState<string>('');

    const userId = recommendPost.recommendWriter;

    const categoryMap: { [key: string]: string } = {
        food: '먹거리',
        attraction: '관광지',
        mission: '미션',
    };

    const getUserInfoResponse = (responseBody: GetUserInfoResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '내역을 입력해주세요.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { nickname } = responseBody as GetUserInfoResponseDto;
        setNicnkname(nickname);
    };

    useEffect(() => {
        if (!userId) return;
        getUserInfoRequest(userId).then(getUserInfoResponse);
    }, [userId]);

    const categoryText = categoryMap[recommendPost.recommendCategory];

    return (
        <div className="recommend-post-item-header">
            <div className="recommend-writer">{nickname}님의 추천 {categoryText} 루트</div>
            <div className="recommend-created-at">{recommendPost.recommendCreatedAt}</div>
        </div>
    );
}

function AttractionRow({ recommendAttraction, userId, index }: Attractions) {
    const [attractionImages, setAttractionImages] = useState<string[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    const postAttractionLikeResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && (responseBody.code === 'LC' || responseBody.code === 'LUC');
        if (!isSuccessed) {
            alert(message);
            return;
        }

        setIsLiked((prev) => !prev); 
    };

    const onLikeButtonClickHandler = () => {
        postAttractionLikeRequest(recommendAttraction.attractionId, accessToken).then(postAttractionLikeResponse);
    };

    useEffect(() => {
        setAttractionImages(recommendAttraction.images.map((image) => image.imageUrl));
        setIsLiked(recommendAttraction.likeList.some((user) => user === userId));
    }, [recommendAttraction, userId]);

    return (
        <div className="attraction-box">
            <div className="attraction-image">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                >
                    {attractionImages.map((imageUrl, index) => (
                        <SwiperSlide key={index}>
                            <img src={imageUrl} alt={`Attraction ${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="attraction-details">
                <div className="attraction-number">{index + 1}</div>
                <div className="attraction-details-content">
                    <div className="attraction-name">{recommendAttraction.attractionName}</div>
                    <div className="attraction-address">{recommendAttraction.attractionAddress}</div>
                    <div className="attraction-content tooltip-container">
                        {recommendAttraction.attractionContent.length > 30
                            ? `${recommendAttraction.attractionContent.slice(0, 15)} ...더보기`
                            : recommendAttraction.attractionContent}
                        {recommendAttraction.attractionContent.length > 30 && (
                            <span className="tooltip-text">{recommendAttraction.attractionContent}</span>
                        )}
                    </div>
                </div>
                {accessToken && (
                    <div className="attraction-like-button" onClick={onLikeButtonClickHandler}>
                        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                    </div>
                )}
            </div>
        </div>
    );
}

function MissionRow({ recommendMission, userId, index }: Missions & { index: number }) {
    const [missionImages, setMissionImages] = useState<string[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    const postMissionLikeResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
            responseBody.code === 'NRM' ? '존재하지 않는 미션입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && (responseBody.code === 'LC' || responseBody.code === 'LUC');
        if (!isSuccessed) {
            alert(message);
            return;
        }

        setIsLiked(!isLiked);
    };

    const onLikeButtonClickHandler = () => {
        postMissionLikeRequest(recommendMission.missionId, accessToken).then(postMissionLikeResponse);
    };

    useEffect(() => {
        setMissionImages(recommendMission.images.map((image) => image.imageUrl));
        setIsLiked(recommendMission.likeList.some((user) => user === userId));
    }, [recommendMission, userId]);

    return (
        <div className="mission-box">
            <div className="mission-image">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                >
                    {missionImages.map((imageUrl, index) => (
                        <SwiperSlide key={index}>
                            <img src={imageUrl} alt={`Mission ${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="mission-details">
                <div className="mission-number">{index + 1}</div>
                <div className="mission-details-content">
                    <div className="mission-name">{recommendMission.missionName}</div>
                    <div className="mission-content tooltip-container">
                        {recommendMission.missionContent.length > 30
                            ? `${recommendMission.missionContent.slice(0, 15)} ...더보기`
                            : recommendMission.missionContent}
                        {recommendMission.missionContent.length > 30 && (
                            <span className="tooltip-text">{recommendMission.missionContent}</span>
                        )}
                    </div>
                </div>
                {accessToken && (
                    <div className="mission-like-button" onClick={onLikeButtonClickHandler}>
                        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                    </div>
                )}
            </div>
        </div>
    );
}

function FoodRow({ recommendFood, userId, index }: Foods & { index: number }) {
    const [foodImages, setFoodImages] = useState<string[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    const postFoodLikeResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
            responseBody.code === 'NRF' ? '존재하지 않는 음식입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && (responseBody.code === 'LC' || responseBody.code === 'LUC');
        if (!isSuccessed) {
            alert(message);
            return;
        }

        setIsLiked(!isLiked);
    };

    const onLikeButtonClickHandler = () => {
        postFoodLikeRequest(recommendFood.foodId, accessToken).then(postFoodLikeResponse);
    };

    useEffect(() => {
        setFoodImages(recommendFood.images.map((image) => image.imageUrl));
        setIsLiked(recommendFood.likeList.some((user) => user === userId));
    }, [recommendFood, userId]);

    return (
        <div className="food-box">
            <div className="food-image">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                >
                    {foodImages.map((imageUrl, index) => (
                        <SwiperSlide key={index}>
                            <img src={imageUrl} alt={`Food ${index}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="food-details">
                <div className="food-number">{index + 1}</div>
                <div className="food-details-content">
                    <div className="food-name">{recommendFood.foodName}</div>
                    <div className="food-content tooltip-container">
                        {recommendFood.foodContent.length > 30
                            ? `${recommendFood.foodContent.slice(0, 15)} ...더보기`
                            : recommendFood.foodContent}
                        {recommendFood.foodContent.length > 30 && (
                            <span className="tooltip-text">{recommendFood.foodContent}</span>
                        )}
                    </div>
                </div>

                {accessToken && (
                    <div className="food-like-button" onClick={onLikeButtonClickHandler}>
                        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Recommend() {

    const { category } = useParams();

    const [posts, setPosts] = useState<RecommendPost[]>([]);
    const [attractions, setAttractions] = useState<RecommendAttraction[]>([]);
    const [foods, setFoods] = useState<RecommendFood[]>([]);
    const [missions, setMissions] = useState<RecommendMission[]>([]);

    const [visiblePosts, setVisiblePosts] = useState<number>(5); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const observerRef = useRef(null);

    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    const [userId, setUserId] = useState<string>('');

    const getSignInUserResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { userId } = responseBody as GetSignInResponseDto;
        setUserId(userId);
    }

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
    }

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

    const loadMorePosts = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisiblePosts((prev) => prev + 5); 
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        if (!category) return;
        getSignInRequest(accessToken).then(getSignInUserResponse);
        getRecommendPostListRequest(category).then(getRecommendPostListResponse);

        if (category === 'attraction') {
            getRecommendAttractionListRequest().then(getRecommendAttractionListResponse);
        } else if (category === 'food') {
            getRecommendFoodListRequest().then(getRecommendFoodListResponse);
        } else if (category === 'mission') {
            getRecommendMissionListRequest().then(getRecommendMissionListResponse); 
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
    }, [category, accessToken]);

    const filteredAttractions = attractions.filter(attraction => 
        posts.some(post => post.recommendId === attraction.recommendId)
    );

    const filteredFoods = foods.filter(food => 
        posts.some(post => post.recommendId === food.recommendId)
    );

    const filteredMissions = missions.filter(mission =>
        posts.some(post => post.recommendId === mission.recommendId)
    );

    return (
        <div className="recommend-post">
            <div className="share-banner">
                <Banner />
            </div>
    
            <div className="recommend-post-content">
                {posts.slice(0, visiblePosts).map((post) => {
                    const matchedAttractions = filteredAttractions.filter(
                        (attraction) => attraction.recommendId === post.recommendId
                    );
                    const matchedMissions = filteredMissions.filter(
                        (mission) => mission.recommendId === post.recommendId
                    );
                    const matchedFoods = filteredFoods.filter(
                        (food) => food.recommendId === post.recommendId
                    );
    
                    const attractionsCount = matchedAttractions.length;
                    const missionsCount = matchedMissions.length;
                    const foodsCount = matchedFoods.length;
    
                    return (
                        <div key={post.recommendId} className="recommend-post-item">
                            <PostRow recommendPost={post} />
    
                            <div className="recommend-attraction-item">
                                {attractionsCount > 3 ? (
                                    <Swiper
                                        spaceBetween={15}
                                        slidesPerView={3}
                                        navigation={true}
                                        loop={false}
                                    >
                                        {matchedAttractions.map((attraction, index) => (
                                            <SwiperSlide key={attraction.attractionId}>
                                                <AttractionRow
                                                    recommendAttraction={attraction}
                                                    userId={userId}
                                                    index={index}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    matchedAttractions.map((attraction, index) => (
                                        <AttractionRow
                                            key={attraction.attractionId}
                                            recommendAttraction={attraction}
                                            userId={userId}
                                            index={index}
                                        />
                                    ))
                                )}
                            </div>
    
                            <div className="recommend-mission-item">
                                {missionsCount > 3 ? (
                                    <Swiper
                                        spaceBetween={15}
                                        slidesPerView={3}
                                        navigation={true}
                                        loop={false}
                                    >
                                        {matchedMissions.map((mission, index) => (
                                            <SwiperSlide key={mission.missionId}>
                                                <MissionRow
                                                    recommendMission={mission}
                                                    userId={userId}
                                                    index={index}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    matchedMissions.map((mission, index) => (
                                        <MissionRow
                                            key={mission.missionId}
                                            userId={userId}
                                            recommendMission={mission}
                                            index={index}
                                        />
                                    ))
                                )}
                            </div>
                            
                            <div className="recommend-food-item">
                                {foodsCount > 3 ? (
                                    <Swiper
                                        spaceBetween={15}
                                        slidesPerView={3}
                                        navigation={true}
                                        loop={false}
                                    >
                                        {matchedFoods.map((food, index) => (
                                            <SwiperSlide key={food.foodId}>
                                                <FoodRow
                                                    recommendFood={food}
                                                    userId={userId}
                                                    index={index}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    matchedFoods.map((food, index) => (
                                        <FoodRow
                                            key={food.foodId}
                                            recommendFood={food}
                                            userId={userId}
                                            index={index}
                                        />
                                    ))
                                )}
                            </div>
                            <hr className="post-divider" />
                        </div>
                    );
                })}
            </div>
    
            {isLoading && <div className="loading-spinner">Loading...</div>}
    
            <div ref={observerRef} style={{ height: "1px" }}></div>
        </div>
    );

}

