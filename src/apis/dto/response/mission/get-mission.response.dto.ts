import { Mission } from "types";
import ResponseDto from "../response.dto";

export default interface GetMissionResponseDto extends ResponseDto {
    missions: Mission[];
}