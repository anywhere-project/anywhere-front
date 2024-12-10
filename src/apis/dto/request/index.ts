import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "../response";

const ANYWHERE_API_DOMAIN = "http://localhost:4000"

const AREA_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/area`

const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
};

const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};


// export const getAreaListRequest = async () => {
//     const responseBody = await axios.get(AREA_MODULE_URL)
//         .then(responseDataHandler<GetAreaResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };