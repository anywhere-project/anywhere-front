import { ReviewComment } from "types";
import ResponseDto from "../response.dto";

export default interface GetReviewCommentListResponseDto extends ResponseDto{
    reviewComments: ReviewComment[];
}