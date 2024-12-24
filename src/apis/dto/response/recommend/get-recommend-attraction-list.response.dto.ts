import ResponseDto from "../response.dto";
import { RecommendAttraction } from "types";

export default interface GetRecommendAttractionListResponseDto extends ResponseDto {
    attractions: RecommendAttraction[];
}