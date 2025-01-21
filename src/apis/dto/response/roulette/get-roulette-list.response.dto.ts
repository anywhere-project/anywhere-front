import { MyRandom } from "types";
import ResponseDto from "../response.dto";

export default interface GetRouletteListResponseDto extends ResponseDto {
    myRandoms: MyRandom[];
}