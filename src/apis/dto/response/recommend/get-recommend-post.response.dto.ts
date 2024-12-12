import { RecommendAttraction, RecommendFood, RecommendImage, RecommendMission } from "../../../../types";
import ResponseDto from "../response.dto";

export default interface GetRecommendPostResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    attraction: RecommendAttraction;
    food: RecommendFood;
    mission: RecommendMission;
    images: RecommendImage[];
}