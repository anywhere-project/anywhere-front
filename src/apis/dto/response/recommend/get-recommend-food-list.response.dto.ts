import { RecommendFood } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendFoodListResponseDto extends ResponseDto {
    foods: RecommendFood[];
}