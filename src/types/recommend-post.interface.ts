import RecommendAttraction from "./recommend-attraction.interface";
import RecommendFood from "./recommend-food.interface";
import RecommendImage from "./recommend-image.interface";
import RecommendMission from "./recommend-mission.interface";

export default interface RecommendPost {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    attraction: RecommendAttraction[];
    food: RecommendFood[];
    mission: RecommendMission[];
    images: RecommendImage[][];
}