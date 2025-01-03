import { getRecommendAttractionListRequest, getRecommendFoodListRequest, getRecommendMissionListRequest, getRecommendPostListRequest } from "apis";
import { ResponseDto } from "apis/dto/response";
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto, GetRecommendPostListResponseDto } from "apis/dto/response/recommend";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSignInUserStore } from "stores";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { RecommendAttraction, RecommendFood, RecommendMission, RecommendPost } from "types";
import './style.css';
import 'swiper/swiper-bundle.min.css';

interface Posts {
    recommendPost: RecommendPost;
}

interface Attractions {
    recommendAttraction: RecommendAttraction;
}

function PostRow({ recommendPost }: Posts) {
    
    return (
        <div className="recommend-post-item-header">
            <div className="recommend-writer">{recommendPost.recommendWriter}님의 추천 관광지 루트</div>
            <div className="recommend-created-at">{recommendPost.recommendCreatedAt}</div>
        </div>
    );

}

function AttractionRow({ recommendAttraction, index }: Attractions & { index: number }) {
    const [attractionImages, setAttractionImages] = useState<string[]>([]);

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
            </div>
        </div>
    );
}

export default function Recommend() {
    
    const { signInUser } = useSignInUserStore();
    const { category } = useParams();

    const [posts, setPosts] = useState<RecommendPost[]>([]);
    const [attractions, setAttractions] = useState<RecommendAttraction[]>([]);
    const [foods, setFoods] = useState<RecommendFood[]>([]);
    const [mission, setMissions] = useState<RecommendMission[]>([]);

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
    }, [category]);
    

    const filteredAttractions = attractions.filter(attraction => 
        posts.some(post => post.recommendId === attraction.recommendId)
    );

    return (
        <div className="recommend-post">
            <div className="share-banner">
                <p>자신의 추천 루트를 공유하고 다른 사람들과 함께 해보세요!</p>
            </div>

            <div className="recommend-post-content">
                {posts.map((post) => {
                    const matchedAttractions = filteredAttractions.filter(attraction => attraction.recommendId === post.recommendId);
                    const attractionsCount = matchedAttractions.length;
                    
                    return (
                        <div key={post.recommendId} className="recommend-post-item">
                            <PostRow recommendPost={post} />
                            <div className="recommend-attraction-item">
                                {attractionsCount >= 3 ? (
                                    <Swiper
                                        spaceBetween={15}
                                        slidesPerView={3}
                                        navigation={true}
                                        loop={true}
                                    >
                                        {matchedAttractions.map((attraction, index) => (
                                            <SwiperSlide key={attraction.attractionId}>
                                                <AttractionRow recommendAttraction={attraction} index={index} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    matchedAttractions.map((attraction, index) => (
                                        <AttractionRow key={attraction.attractionId} recommendAttraction={attraction} index={index} />
                                    ))
                                )}
                            </div>
                            <hr className="post-divider" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
}

