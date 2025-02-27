import PostRecommendAttractionRequestDto from "./post-recommend-attraction.request.dto";
import PostRecommendFoodRequestDto from "./post-recommend-food.request.dto";
import PostRecommendMissionRequestDto from "./post-recommend-mission.request.dto";

export default interface PostRecommendPostRequestDto {
    recommendCategory: string;
    foods: PostRecommendFoodRequestDto[] | null;
    attractions: PostRecommendAttractionRequestDto[] | null;
    missions: PostRecommendMissionRequestDto[] | null;
}