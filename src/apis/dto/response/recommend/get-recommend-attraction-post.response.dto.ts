import ResponseDto from "../response.dto";
import { RecommendAttraction } from "types";

export default interface GetRecommendAttractionPostResponseDto extends ResponseDto {
    attractions: RecommendAttraction[];
}