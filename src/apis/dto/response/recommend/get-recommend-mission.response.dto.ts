import { RecommendImage, RecommendMission } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendMissionResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    missions: RecommendMission[];
    images: RecommendImage[];
}