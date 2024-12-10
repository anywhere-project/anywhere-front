import ResponseDto from "../response.dto";

export default interface GetSignInResponseDto extends ResponseDto {
    userId: string;
    password: string;
    name: string;
    nickname: string;
    telNumber: string;
    profileImage: string;
    isAdmin: boolean;
    userStatus: string;
}