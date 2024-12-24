import ResponseDto from "../response.dto";

export default interface GetRecommendFoodResponseDto extends ResponseDto {
    foodId: number;
    recommendId: number;
    foodName: string;
    foodContent: string;
}