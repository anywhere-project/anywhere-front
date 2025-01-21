import ReviewImages from "types/review-image.interface";
import ResponseDto from "../response.dto";
import { Review } from "types";


export default interface GetReviewResponseDto extends ResponseDto {
    reviewId: number;
    reviewContent: string;
    reviewWriter: string;
    reviewCreatedAt: string;
    reviewLikeCount: number;
    imageUrl: ReviewImages[];
    hashTags: string[];
}