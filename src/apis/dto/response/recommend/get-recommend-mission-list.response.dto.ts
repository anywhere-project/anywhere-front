import { RecommendMission } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendMissionListResponseDto extends ResponseDto {
    missions: RecommendMission[];
}