import { Review } from "types";
import ResponseDto from "../response.dto";

export default interface GetReviewPostListResponseDto extends ResponseDto{
    reviewPosts: Review[];
}