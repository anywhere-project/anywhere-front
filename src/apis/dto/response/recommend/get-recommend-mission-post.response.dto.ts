import { RecommendMission } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendMissionPostResponseDto extends ResponseDto {
    missions: RecommendMission[];
}