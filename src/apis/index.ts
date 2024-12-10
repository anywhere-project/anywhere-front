import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostRecommendAttractionRequestDto, PostRecommendFoodRequestDto, PostRecommendMissionRequestDto, PostRecommendPostRequestDto } from "./dto/request/recommend";
import { GetRecommendPostListResponseDto } from "./dto/response/recommend";
import { GetSignInResponseDto, SignInResponseDto } from "./dto/response/auth";

const ANYWHERE_API_DOMAIN = "http://localhost:4000";

const AUTH_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/auth`;
const RECOMMEND_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/recommend`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const GET_RECOMMNED_POST_LIST_API_URL = `${RECOMMEND_MODULE_URL}`;
const POST_RECOMMEND_POST_API_URL = `${RECOMMEND_MODULE_URL}`;
const PATCH_RECOMMEND_POST_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}`;
const DELETE_RECOMMEND_POST_API_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}`;

const POST_RECOMMEND_MISSION_URL = (recommendId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/mission`;
const PATCH_RECOMMEND_MISSION_URL = (recommendId: number | string, missionId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/mission/${missionId}`;
const DELETE_RECOMMEND_MISSION_URL = (recommendId: number | string, missionId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/mission/${missionId}`;

const POST_RECOMMEND_FOOD_URL = (recommendId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/food`;
const PATCH_RECOMMEND_FOOD_URL = (recommendId: number | string, foodId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/food/${foodId}`;
const DELETE_RECOMMEND_FOOD_URL = (recommendId: number | string, foodId: number | string) =>`${RECOMMEND_MODULE_URL}/${recommendId}/food/${foodId}`;

const POST_RECOMMEND_ATTRACTION_URL = (recommendId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction`;
const PATCH_RECOMMEND_ATTRACTION_URL = (recommendId: number | string, attractionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction/${attractionId}`;
const DELETE_RECOMMEND_ATTRACTION_URL = (recommendId: number | string, attractionId: number | string) => `${RECOMMEND_MODULE_URL}/${recommendId}/attraction/${attractionId}`;

// function: Authorizarion Bearer 헤더 //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` } })

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
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
export const patchRecommendPostRequest = async (requestBody: PatchRecommendPostRequestDto, recommendId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_POST_API_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
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

// function: 추천 게시글 리스트 가져오기 요청 함수 //
export const getRecommendPostListRequest = async () => {
    const responseBody = await axios.get(GET_RECOMMNED_POST_LIST_API_URL)
        .then(responseDataHandler<GetRecommendPostListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 작성 요청 함수 //
export const postRecommendAttractionRequest = async (requestBody: PostRecommendAttractionRequestDto, recommendId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_ATTRACTION_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 수정 요청 함수 //
export const patchRecommendAttractionRequest = async (requestBody: PatchRecommendAttractionRequestDto, recommendId: string | number, attractionId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_ATTRACTION_URL(recommendId, attractionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 관광지 삭제 요청 함수 //
export const deleteRecommendAttractionRequest = async (recommendId: string | number, attractionId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_ATTRACTION_URL(recommendId, attractionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 작성 요청 함수 //
export const postRecommendFoodRequest = async (requestBody: PostRecommendFoodRequestDto, recommendId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_FOOD_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 수정 요청 함수 //
export const patchRecommendFoodRequest = async (requestBody: PatchRecommendFoodRequestDto, recommendId: string | number, foodId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_FOOD_URL(recommendId, foodId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 먹거리 삭제 요청 함수 //
export const deleteRecommendFoodRequest = async (recommendId: string | number, foodId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_FOOD_URL(recommendId, foodId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 작성 요청 함수 //
export const postRecommendMissionRequest = async (requestBody: PostRecommendMissionRequestDto, recommendId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_MISSION_URL(recommendId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 수정 요청 함수 //
export const patchRecommendMissionRequest = async (requestBody: PatchRecommendMissionRequestDto, recommendId: string | number, missionId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_MISSION_URL(recommendId, missionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 삭제 요청 함수 //
export const deleteRecommendMissionRequest = async (recommendId: string | number, missionId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_RECOMMEND_MISSION_URL(recommendId, missionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};
