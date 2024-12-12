import PostRecommendAttractionRequestDto from "./post-recommend-attraction.request.dto";
import PostRecommendFoodRequestDto from "./post-recommend-food.request.dto";
import PostRecommendImageRequestDto from "./post-recommend-image.request.dto";
import PostRecommendMissionRequestDto from "./post-recommend-mission.request.dto";

export default interface PostRecommendPostRequestDto {
    food?: PostRecommendFoodRequestDto | null;
    attraction?: PostRecommendAttractionRequestDto | null;
    mission?: PostRecommendMissionRequestDto | null;
    images: PostRecommendImageRequestDto[];
}