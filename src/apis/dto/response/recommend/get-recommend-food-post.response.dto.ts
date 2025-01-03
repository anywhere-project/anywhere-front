import { RecommendFood } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendFoodPostResponseDto extends ResponseDto {
    foods: RecommendFood[];
}