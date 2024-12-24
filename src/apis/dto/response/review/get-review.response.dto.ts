import ResponseDto from "../response.dto";


export default interface GetReviewResponseDto extends ResponseDto {
    reviewId: number;
    reviewContent: string;
    reviewWriter: string;
    reviewCreatedAt: string;
    reviewLikeCount: number;
}