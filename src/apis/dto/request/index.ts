import axios, { AxiosResponse } from "axios";
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostAttractionImageRequestDto, PostFoodImageRequestDto, PostMissionImageRequestDto, PostRecommendAttractionRequestDto, PostRecommendFoodRequestDto, PostRecommendMissionRequestDto, PostRecommendPostRequestDto } from "../request/recommend";
import { ResponseDto } from "../response";
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./auth";
import SignInRequestDto from "./auth/sign-in.request.dto";
import { SignInResponseDto } from "../response/auth";
import { GetAreaResponseDto } from "../response/area";
import { GetAttractionResponseDto } from "../response/attraction";
import { GetFoodResponseDto } from "../response/food";
import GetMissionResponseDto from "../response/mission/get-mission.response.dto";

const ANYWHERE_API_DOMAIN = "http://localhost:4000";

const AUTH_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/auth`;
const RECOMMEND_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/recommend`;
const AREA_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/area`;
const ATTRACTION_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/attraction`
const FOOD_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/food`;
const MISSION_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/mission`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const POST_RECOMMEND_POST_API_URL = `${RECOMMEND_MODULE_URL}`;
const PATCH_RECOMMEND_POST_API_URL = (recommendId: number | string, category: string) => `${RECOMMEND_MODULE_URL}/${recommendId}/${category}`;
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

const POST_ATTRACTION_IMAGE_API_URL = (attractionId: string | number) => `${RECOMMEND_MODULE_URL}/attraction/${attractionId}`;
const DELETE_ATTRACTION_IMAGE_API_URL = (attractionId: string | number, imageId: string | number) => `${RECOMMEND_MODULE_URL}/attraction/${attractionId}/image/${imageId}`;

const POST_FOOD_IMAGE_API_URL = (foodId: string | number) => `${RECOMMEND_MODULE_URL}/food/${foodId}`;
const DELETE_FOOD_IMAGE_API_URL = (foodId: string | number, imageId: string | number) => `${RECOMMEND_MODULE_URL}/food/${foodId}/image/${imageId}`;

const POST_MISSION_IMAGE_API_URL = (missionId: string | number) => `${RECOMMEND_MODULE_URL}/mission/${missionId}`;
const DELETE_MISSION_IMAGE_API_URL = (missionId: string | number, imageId: string | number) => `${RECOMMEND_MODULE_URL}/mission/${missionId}/image/${imageId}`;

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

// function: 추천 게시글 작성 요청 함수 //
export const postRecommendPostRequest = async (requestBody: PostRecommendPostRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_RECOMMEND_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 게시글 수정 요청 함수 //
export const patchRecommendPostRequest = async (requestBody: PatchRecommendPostRequestDto, recommendId: string | number, category: string,  accessToken: string) => {
    const responseBody = await axios.patch(PATCH_RECOMMEND_POST_API_URL(recommendId, category), requestBody, bearerAuthorization(accessToken))
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

// function: 추천 관광지 사진 작성 요청 함수 // 
export const postAttractionImageRequest = async (requestBody: PostAttractionImageRequestDto, attractionId: string | number, accessToken: string) => {
    const resopnseBody = await axios.post(POST_ATTRACTION_IMAGE_API_URL(attractionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return resopnseBody;
}

// function: 추천 관광지 사진 삭제 요청 함수 //
export const deleteAttractionImageRequest = async (attractionId: string | number, imageId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ATTRACTION_IMAGE_API_URL(attractionId, imageId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 음식 사진 작성 요청 함수 //
export const postFoodImageRequest = async (requestBody: PostFoodImageRequestDto, foodId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_FOOD_IMAGE_API_URL(foodId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 음식 사진 삭제 요청 함수 //
export const deleteFoodImageRequest = async (foodId: string | number, imageId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_FOOD_IMAGE_API_URL(foodId, imageId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 사진 작성 요청 함수 //
export const postMissionImageRequest = async (requestBody: PostMissionImageRequestDto, missionId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_MISSION_IMAGE_API_URL(missionId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 사진 삭제 요청 함수 //
export const deleteMissionImageRequest = async (missionId: string | number, imageId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_MISSION_IMAGE_API_URL(missionId, imageId), bearerAuthorization(accessToken))
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

// function: 룰렛 지역 가져오기 요청 함수 //
export const getAreaListRequest = async () => {
    const responseBody = await axios.get(AREA_MODULE_URL)
        .then(responseDataHandler<GetAreaResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

export const getAttractionListRequest = async () => {
    const responseBody = await axios.get(ATTRACTION_MODULE_URL)
        .then(responseDataHandler<GetAttractionResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

export const getFoodListRequest = async () => {
    const responseBody = await axios.get(FOOD_MODULE_URL)
        .then(responseDataHandler<GetFoodResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

export const getMissionListRequest = async () => {
    const responseBody = await axios.get(MISSION_MODULE_URL)
        .then(responseDataHandler<GetMissionResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};