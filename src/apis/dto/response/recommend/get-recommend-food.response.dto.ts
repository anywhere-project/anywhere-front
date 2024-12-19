import { RecommendFood, RecommendImage } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendFoodResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    recommendCategory: string;
    foods: RecommendFood[];
    images: RecommendImage[];
}