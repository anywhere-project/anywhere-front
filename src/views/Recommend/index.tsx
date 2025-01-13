import { getRecommendAttractionListRequest, getRecommendFoodListRequest, getRecommendMissionListRequest, getRecommendPostListRequest, getUserInfoRequest, postAttractionLikeRequest, postFoodLikeRequest, postMissionLikeRequest } from "apis";
import { ResponseDto } from "apis/dto/response";
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto, GetRecommendPostListResponseDto } from "apis/dto/response/recommend";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import GetUserInfoResponseDto from "apis/dto/response/user/get-user-info.response.dto";
import { RecommendAttraction, RecommendFood, RecommendMission, RecommendPost } from "types";
import './style.css';
import 'swiper/swiper-bundle.min.css';
import { useCookies } from "react-cookie";
import { ACCESS_TOKEN } from "../../constants";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Posts {
    recommendPost: RecommendPost;
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

function AttractionRow({ recommendAttraction, index }: Attractions & { index: number }) {
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

        setIsLiked(!isLiked);
    };

    const onLikeButtonClickHandler = () => {
        postAttractionLikeRequest(recommendAttraction.attractionId, accessToken).then(postAttractionLikeResponse);
    }

    useEffect(() => {
        setAttractionImages(recommendAttraction.images.map((image) => image.imageUrl)); 
    }, [recommendAttraction]);

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
                    <div className="attraction-content">{recommendAttraction.attractionContent}</div>
                </div>
                {accessToken && (
                    <div className="attraction-like-button" onClick={onLikeButtonClickHandler}>{isLiked ? <FaHeart color="red" /> : <FaRegHeart />}</div>
                )}
            </div>
        </div>
    );
}

function MissionRow({ recommendMission, index }: Missions & { index: number }) {
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
    }, [recommendMission]);

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
                    <div className="mission-content">{recommendMission.missionContent}</div>
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

function FoodRow({ recommendFood, index }: Foods & { index: number }) {
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
    }, [recommendFood]);

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
                    <div className="food-content">{recommendFood.foodContent}</div>
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
    }, [category]);

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
                <p>자신의 추천 루트를 공유하고 다른 사람들과 함께 해보세요!</p>
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
                                                    index={index}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    matchedMissions.map((mission, index) => (
                                        <MissionRow
                                            key={mission.missionId}
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

