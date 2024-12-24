import Attraction from "../../../../types/attraction-get.interface";
import ResponseDto from "../response.dto";

export default interface GetAttractionResponseDto extends ResponseDto {
    attractions: Attraction[];
}