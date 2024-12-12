import { Area } from "types";
import ResponseDto from "../response.dto";

// interface: get gifticon response body dto //
export default interface GetAreaResponseDto extends ResponseDto {
    areas: Area[];
}