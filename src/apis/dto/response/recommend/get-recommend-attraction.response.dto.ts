import { RecommendAttraction, RecommendImage } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendAttractionResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    attractions: RecommendAttraction[];
    images: RecommendImage[];
}