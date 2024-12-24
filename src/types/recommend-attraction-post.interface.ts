import RecommendAttraction from "./recommend-attraction.interface";
import RecommendImage from "./recommend-image.interface";

export default interface RecommendAttractionPost {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    attractions: RecommendAttraction[];
    images: RecommendImage[];
}