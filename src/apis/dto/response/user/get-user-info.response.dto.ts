import ResponseDto from "../response.dto";

export default interface GetUserInfoResponseDto extends ResponseDto {
    userId: string;
    nickname: string;
}
