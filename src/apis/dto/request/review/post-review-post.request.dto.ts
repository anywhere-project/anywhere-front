export default interface PostReviewRequestDto{
    reviewId: number;
    reviewContent: string;
    reviewWriter: string;
    reviewCreatedAt: string;
    reviewLikeCount: number;
}