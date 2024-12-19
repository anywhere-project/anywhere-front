import RecommendFood from "./recommend-food.interface";
import RecommendImage from "./recommend-image.interface";

export default interface RecommendFoodPost {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    foods: RecommendFood[];
    images: RecommendImage[];
}