import Food from "types/food-get.interface";
import ResponseDto from "../response.dto";

export default interface GetFoodResponseDto extends ResponseDto {
    foods: Food[];
}