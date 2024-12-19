import { RecommendFood, RecommendImage } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendFoodResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    foods: RecommendFood[];
    images: RecommendImage[];
}