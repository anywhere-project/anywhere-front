import RecommendImage from "./recommend-image.interface";
import RecommendMission from "./recommend-mission.interface";

export default interface RecommendMissionPost {
    recommendId: number;
    recommendCreatedAt: string;
    recommendWriter: string;
    recommendLikeCount: number;
    missions: RecommendMission[];
    images: RecommendImage[];
}