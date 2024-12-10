import ResponseDto from "../response.dto";

// interface: get gifticon response body dto //
export default interface GetGifticonResponseDto extends ResponseDto {
    areaId: number;
    areaName: string;
}