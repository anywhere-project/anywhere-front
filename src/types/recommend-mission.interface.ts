import MissionImage from "./mission-image.interface";

export default interface RecommendMission {
    missionId: number;
    recommendId: number;
    missionName: string;
    missionContent: string;
    images: MissionImage[];
    likeList: string[];
}