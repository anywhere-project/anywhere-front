export default interface PostReviewCommentRequestDto{
    reviewCommentContent: string;
    parentCommentId: number | null;
}