export default interface ReviewComment {
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