import ResponseDto from "../response.dto";

export default interface GetReviewCommentResponseDto extends ResponseDto {
    reviewCommentId: number;
    reviewId: number;
    reviewCommentWriter: string;
    reviewCommentContent: string;
    reviewCommentCreatedAt: string;
    parentCommentId: number;
    isDeleted: boolean;
    isNextComment: boolean;
    depth: number;
    orderNumber: number;
}

