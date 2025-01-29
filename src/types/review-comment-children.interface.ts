import ReviewComment from "./review-comment.interface";

export interface ReviewCommentWithChildren extends ReviewComment {
    children: ReviewCommentWithChildren[]; // 트리 구조를 위한 children 속성
}