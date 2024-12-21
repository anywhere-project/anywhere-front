import ResponseDto from "../response.dto";

export default interface GetRecommendPostResponseDto extends ResponseDto {
    recommendId: number;
    recommendCreatedAt: string;
    recommendLikeCount: number;
    recommendWriter: string;
    recommendCategory: string;
}