import PatchRecommendAttractionRequestDto from "./patch-recommend-attraction.request.dto";
import PatchRecommendFoodRequestDto from "./patch-recommend-food.request.dto";
import PatchRecommendImageRequestDto from "./patch-recommend-image.request.dto";
import PatchRecommendMissionRequestDto from "./patch-recommend-mission.request.dto";

export default interface PatchRecommendPostRequestDto {
    food?: PatchRecommendFoodRequestDto | null;
    attraction?: PatchRecommendAttractionRequestDto | null;
    mission?: PatchRecommendMissionRequestDto | null;
    images: PatchRecommendImageRequestDto[];
}