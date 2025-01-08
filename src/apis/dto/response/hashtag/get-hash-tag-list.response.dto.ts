import { HashTag } from "../../../../types";
import ResponseDto from "../response.dto";

export default interface GetHashTagListResponseDto extends ResponseDto {
    hashTags: HashTag[];
}