import { RecommendPost } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendPostListResponseDto extends ResponseDto {
    posts: RecommendPost[];
}