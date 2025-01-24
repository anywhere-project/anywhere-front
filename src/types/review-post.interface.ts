import ReviewImages from "./review-image.interface";

export default interface Review {
    reviewId: number;
    reviewContent: string;
    reviewWriter: string;
    reviewCreatedAt: string;
    reviewLikeCount: number;
    imageUrl: ReviewImages[];
    hashtags: string[];
    likes: string[];
}