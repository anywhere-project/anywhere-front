import { RecommendAttraction, RecommendFood, RecommendImage, RecommendMission } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendPostResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    attraction?: RecommendAttraction | null;
    food?: RecommendFood | null;
    mission?: RecommendMission | null;
    images: RecommendImage[];
}
