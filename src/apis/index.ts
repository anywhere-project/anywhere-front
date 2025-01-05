import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostRecommendAttractionRequestDto, PostRecommendFoodRequestDto, PostRecommendMissionRequestDto, PostRecommendPostRequestDto } from "./dto/request/recommend";
import { GetSignInResponseDto, SignInResponseDto } from "./dto/response/auth";
import GetRecommendPostResponseDto from "./dto/response/recommend/get-recommend-post.response.dto";
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendFoodPostResponseDto, GetRecommendMissionListResponseDto, GetRecommendMissionPostResponseDto, GetRecommendPostListResponseDto } from "./dto/response/recommend";

const ANYWHERE_API_DOMAIN = "http://localhost:4000";

const AUTH_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/auth`;
const RECOMMEND_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/recommend`;
const MYPAGE_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/mypage`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${MYPAGE_MODULE_URL}`;

const POST_RECOMMEND_POST_API_URL = `${RECOMMEND_MODULE_URL}`;
const PATCH_RECOMMEND_POST_API_URL = (recommendId: number | string, category: string) => `${RECOMMEND_MODULE_URL}/${recommendId}/${category}`;
const GET_RECOMMEND_POST_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/post/${recommendId}`;
const GET_RECOMMEND_POST_LIST_API_URL = (category: string) => `${RECOMMEND_MODULE_URL}/${category}`;
const DELETE_RECOMMEND_POST_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}`;

const POST_RECOMMEND_ATTRACTION_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction`;
const GET_RECOMMEND_ATTRACTION_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attractions`;
const GET_RECOMMEND_ATTRACTION_LIST_API_URL = `${RECOMMEND_MODULE_URL}/attractions`;
const PATCH_RECOMMEND_ATTRACTION_API_URL = (recommendId: number | string, attractionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction/${attractionId}`;
const DELETE_RECOMMEND_ATTRACTION_API_URL = (recommendId: number | string, attractionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction/${attractionId}`;

const POST_RECOMMEND_FOOD_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/food`;
const GET_RECOMMEND_FOOD_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/foods`;
const GET_RECOMMEND_FOOD_LIST_API_URL = `${RECOMMEND_MODULE_URL}/foods`;
const PATCH_RECOMMEND_FOOD_API_URL = (recommendId: number | string, foodId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/food/${foodId}`;
const DELETE_RECOMMEND_FOOD_API_URL = (recommendId: number | string, foodId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/food/${foodId}`;

const POST_RECOMMEND_MISSION_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/mission`;
const GET_RECOMMEND_MISSION_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/missions`;
const GET_RECOMMEND_MISSION_LIST_API_URL = `${RECOMMEND_MODULE_URL}/missions`;
const PATCH_RECOMMEND_MISSION_API_URL = (recommendId: number | string, missionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/mission/${missionId}`;
const DELETE_RECOMMEND_MISSION_API_URL = (recommendId: number | string, missionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/mission/${missionId}`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    if (Array.isArray(data)) return data[0];
    return data;
}

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};

// function: id check api 요청 함수 //
export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: tel auth check 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 게시글 작성 요청 함수 //
export const postRecommendPostRequest = async (requestBody: PostRecommendPostRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 게시글 수정 요청 함수 //
export const patchRecommendPostRequest = async (requestBody: PatchRecommendPostRequestDto, recommendId: string | number, category: string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_POST_API_URL(recommendId, category), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 게시글 가져오기 요청 함수 //
export const getRecommendPostRequest = async (recommendId: string | number) => {
    const responseBody = await axios.get(GET_RECOMMEND_POST_API_URL(recommendId))
        .then(responseDataHandler<GetRecommendPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 게시글 리스트 가져오기 요청 함수 //
export const getRecommendPostListRequest = async (category: string) => {
    const responseBody = await axios.get(GET_RECOMMEND_POST_LIST_API_URL(category))
        .then(responseDataHandler<GetRecommendPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 게시글 삭제 요청 함수 //
export const deleteRecommendPostRequest = async (recommendId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_POST_API_URL(recommendId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 작성 요청 함수 //
export const postRecommendAttractionRequest = async (requestBody: PostRecommendAttractionRequestDto, recommendId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_ATTRACTION_API_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 수정 요청 함수 //
export const patchRecommendAttractionRequest = async (requestBody: PatchRecommendAttractionRequestDto, recommendId: number | string, attractionId: number | string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_ATTRACTION_API_URL(recommendId, attractionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 가져오기 요청 함수 //
export const getRecommendAttractionRequest = async (recommendId: string | number) => {
    const responseBody = await axios.get(GET_RECOMMEND_ATTRACTION_API_URL(recommendId))
        .then(responseDataHandler<GetRecommendAttractionPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 리스트 가져오기 요청 함수 //
export const getRecommendAttractionListRequest = async () => {
    const responseBody = await axios.get(GET_RECOMMEND_ATTRACTION_LIST_API_URL)
        .then(responseDataHandler<GetRecommendAttractionListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 삭제 요청 함수 //
export const deleteRecommendAttractionRequest = async (recommendId: string | number, attractionId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_ATTRACTION_API_URL(recommendId, attractionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 작성 요청 함수 //
export const postRecommendFoodRequest = async (requestBody: PostRecommendFoodRequestDto, recommendId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_FOOD_API_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 수정 요청 함수 //
export const patchRecommendFoodRequest = async (requestBody: PatchRecommendFoodRequestDto, recommendId: number | string, foodId: number | string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_FOOD_API_URL(recommendId, foodId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 가져오기 요청 함수 //
export const getRecommendFoodRequest = async (recommendId: number | string) => {
    const responseBody = await axios.get(GET_RECOMMEND_FOOD_API_URL(recommendId))
        .then(responseDataHandler<GetRecommendFoodPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 먹거리 리스트 가져오기 요청 함수 //
export const getRecommendFoodListRequest = async () => {
    const responseBody = await axios.get(GET_RECOMMEND_FOOD_LIST_API_URL)
        .then(responseDataHandler<GetRecommendFoodListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 먹거리 삭제 요청 함수 //
export const deleteRecommendFoodRequest = async (recommendId: string | number, foodId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_FOOD_API_URL(recommendId, foodId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 작성 요청 함수 //
export const postRecommendMissionRequest = async (requestBody: PostRecommendMissionRequestDto, recommendId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_MISSION_API_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 수정 요청 함수 //
export const patchRecommendMissionRequest = async (requestBody: PatchRecommendMissionRequestDto, recommendId: number | string, missionId: number | string, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_MISSION_API_URL(recommendId, missionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 가져오기 요청 함수 //
export const getRecommendMissionRequest = async (recommendId: number | string) => {
    const responseBody = await axios.get(GET_RECOMMEND_MISSION_API_URL(recommendId))
        .then(responseDataHandler<GetRecommendMissionPostResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 미션 리스트 가져오기 요청 함수 //
export const getRecommendMissionListRequest = async () => {
    const responseBody = await axios.get(GET_RECOMMEND_MISSION_LIST_API_URL)
        .then(responseDataHandler<GetRecommendMissionListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 미션 삭제 요청 함수 //
export const deleteRecommendMissionRequest = async (recommendId: string | number, missionId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_MISSION_API_URL(recommendId, missionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

const FILE_UPLOAD_URL = `${ANYWHERE_API_DOMAIN}/file/upload`;

const multipart = (accessToken: string) => ({ headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${accessToken}` } })

export const fileUploadRequest = async (requestBody: FormData, accessToken: string) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart(accessToken))
        .then(responseDataHandler<string>)
        .catch(error => null)
    return url;
}

// export const getAreaListRequest = async () => {
//     const responseBody = await axios.get(AREA_MODULE_URL)
//         .then(responseDataHandler<GetAreaResponseDto>)
//         .catch(responseErrorHandler);
//     return responseBody;
// };