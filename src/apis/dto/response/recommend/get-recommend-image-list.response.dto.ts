import { RecommendImage } from "types";
import ResponseDto from "../response.dto";

export default interface GetRecommendImageListResponseDto extends ResponseDto {
    images: RecommendImage[];
}