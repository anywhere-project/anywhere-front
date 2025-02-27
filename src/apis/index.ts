import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./dto/response";
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth";
import SignInRequestDto from "./dto/request/auth/sign-in.request.dto";
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostRecommendAttractionRequestDto, PostRecommendFoodRequestDto, PostRecommendMissionRequestDto, PostRecommendPostRequestDto } from "./dto/request/recommend";
import { GetSignInResponseDto, SignInResponseDto } from "./dto/response/auth";
import GetRecommendPostResponseDto from "./dto/response/recommend/get-recommend-post.response.dto";
import { PatchReviewCommentRequestDto, PostReviewCommentRequestDto, PostReviewRequestDto } from "./dto/request/review";
import { GetRecommendAttractionListResponseDto, GetRecommendAttractionPostResponseDto, GetRecommendFoodListResponseDto, GetRecommendFoodPostResponseDto, GetRecommendMissionListResponseDto, GetRecommendMissionPostResponseDto, GetRecommendPostListResponseDto } from "./dto/response/recommend";
import { GetHashTagListResponseDto } from "./dto/response/hashtag";
import GetReviewPostListResponseDto from "./dto/response/review/get-review-list.response.dto";
import GetUserInfoResponseDto from "./dto/response/user/get-user-info.response.dto";
import PatchReviewPostRequestDto from "./dto/request/review/patch-review-post.request.dto";
import GetReviewResponseDto from "./dto/response/review/get-review.response.dto";
import { PostRouletteRequestDto, PostAreaRequestDto, PostFoodRequestDto, PostAttractionRequestDto, PostMissionRequestDto } from "./dto/request/roulette";
import { GetRouletteListResponseDto } from "./dto/response/roulette";
import GetReviewCommentListResponseDto from "./dto/response/review/get-review-comment-list.response.dto";

import PatchPasswordRequestDto from "./dto/request/user/patch-password.request.dto";
import PatchTelAuthRequestDto from "./dto/request/user/patch-tel-auth.request.dto";
import { PatchUserRequestDto } from "./dto/request/user";
import PatchTelAuthCheckRequestDto from "./dto/request/user/patch-tel-auth-check.request.dto";
import GetReviewCommentResponseDto from "./dto/response/review/get-review-comment.dto";


const ANYWHERE_API_DOMAIN = "http://localhost:4000";

const AUTH_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/auth`;
const RECOMMEND_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/recommend`;
const REVIEW_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/review`;
const MYPAGE_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/mypage`;
const ROULETTE_MODULE_URL = `${ANYWHERE_API_DOMAIN}/api/v1/roulette`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const GET_SIGN_IN_API_URL = `${MYPAGE_MODULE_URL}`;
const GET_USER_INFO_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/user/${userId}`;
const PATCH_USER_INFO_API_URL = (userId: string) => `${MYPAGE_MODULE_URL}/update/${userId}`;
const PATCH_MYPAGE_PASSWORD_API_URL = `${MYPAGE_MODULE_URL}/update-password`;
const PATCH_MYPAGE_TEL_AUTH_API_URL = `${MYPAGE_MODULE_URL}/tel-auth`;
const PATCH_MYPAGE_API_URL = `${MYPAGE_MODULE_URL}`;
const PATCH_MYPAGE_TEL_AUTH_CHECK_API_URL = `${MYPAGE_MODULE_URL}/tel-auth-check`;

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

const POST_ATTRACTION_LIKE_API_URL = (attractionId: number | string) => `${RECOMMEND_MODULE_URL}/attraction/like/${attractionId}`;
const POST_FOOD_LIKE_API_URL = (foodId: number | string) => `${RECOMMEND_MODULE_URL}/food/like/${foodId}`;
const POST_MISSION_LIKE_API_URL = (missionId: number | string) => `${RECOMMEND_MODULE_URL}/mission/like/${missionId}`;

const POST_REVIEW_POST_API_URL = `${REVIEW_MODULE_URL}`;
const POST_REVIEW_LIKE_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/like`;
const GET_REVIEW_POST_LIST_API_URL =  `${REVIEW_MODULE_URL}`;
const GET_REVIEW_POST_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}`;
const PATCH_REVIEW_POST_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}`;
const DELETE_REVIEW_POST_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}`;
const GET_HASH_TAG_LIST_API_URL = `${REVIEW_MODULE_URL}/hash-tag`;
const GET_REVIEW_COMMENT_LIST_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/comment`;
const GET_REVIEW_COMMENT_API_URL = (reviewId: number | string, reviewCommentId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/comment/${reviewCommentId}`;
const POST_REVIEW_COMMENT_API_URL = (reviewId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/comment`;
const UPDATE_REVIEW_COMMENT_API_URL = (reviewId: number | string, reviewCommentId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/comment/${reviewCommentId}`;
const DELETE_REVIEW_COMMENT_API_URL = (reviewId: number | string, reviewCommentId: number | string) => `${REVIEW_MODULE_URL}/${reviewId}/comment/${reviewCommentId}`;

const POST_AREA_API_URL  = `${ROULETTE_MODULE_URL}/area`;
const POST_ATTRACTION_API_URL  = (areaId: number | string) => `${ROULETTE_MODULE_URL}/attraction/${areaId}`;
const POST_FOOD_API_URL  = `${ROULETTE_MODULE_URL}/food`;
const POST_MISSION_API_URL  = `${ROULETTE_MODULE_URL}/mission`;

const DELETE_AREA_API_URL = (areaId: number | string)  => `${ROULETTE_MODULE_URL}/area/${areaId}`;
const DELETE_ATTRACTION_API_URL = (areaId: number | string, attractionId: number | string)  => `${ROULETTE_MODULE_URL}/attraction/${areaId}/${attractionId}`;
const DELETE_FOOD_API_URL = (foodId: number | string)  => `${ROULETTE_MODULE_URL}/food/${foodId}`;
const DELETE_MISSION_API_URL = (missionId: number | string)  => `${ROULETTE_MODULE_URL}/mission/${missionId}`;

const POST_MY_RANDOM_API_URL = `${ROULETTE_MODULE_URL}/my-random`;
const DELETE_MY_RANDOM_API_URL = (randomId: string | number) => `${ROULETTE_MODULE_URL}/my-random/${randomId}`;
const GET_MY_RANDOM_LIST_API_URL = `${ROULETTE_MODULE_URL}/my-random`;

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

// function: patch sign in 요청 함수 //
export const patchUserInfoRequest = async(accessToken: string, userId: string) => {
    const responseBody = await axios.patch(PATCH_USER_INFO_API_URL(userId), bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
    .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 비밀번호 변경 요청 함수 //
export const patchPasswordRequest = async (requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_PASSWORD_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 전화번호 수정 요청 함수 //
export const patchTelAuthRequest = async (requestBody: PatchTelAuthRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(TEL_AUTH_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 인증번호 확인 요청 함수 //
export const patchTelAuthCheckRequest = async (requestBody: PatchTelAuthCheckRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(TEL_AUTH_CHECK_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 유저 정보 수정 요청 함수 //
export const patchUserRequest = async (requestBody: PatchUserRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_MYPAGE_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}


// function: 게시글 유저 정보 리스트 요청 함수 //
export const getUserInfoRequest = async (userId: string) => {
    const responseBody = await axios.get(GET_USER_INFO_API_URL(userId))
        .then(responseDataHandler<GetUserInfoResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

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

// function: 해시태그 리스트 가져오기 요청 함수 //
export const getHashTagListRequest = async () => {
    const responseBody = await axios.get(GET_HASH_TAG_LIST_API_URL)
        .then(responseDataHandler<GetHashTagListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 추천 관광지 좋아요 요청 함수 //
export const postAttractionLikeRequest = async(attractionId: string | number, accessToken: string) => {
    const repsonseBody = await axios.post(POST_ATTRACTION_LIKE_API_URL(attractionId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return repsonseBody;
}

// function: 추천 먹거리 좋아요 요청 함수 //
export const postFoodLikeRequest = async (foodId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_FOOD_LIKE_API_URL(foodId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 추천 미션 좋아요 요청 함수 //
export const postMissionLikeRequest = async (missionId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_MISSION_LIKE_API_URL(missionId), {}, bearerAuthorization(accessToken))
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

// function: 후기 게시글 작성 요청 함수 //
export const postReviewRequest = async (requestBody: PostReviewRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_REVIEW_POST_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 후기 게시글 리스트 가져오기 요청 함수 //
export const getReviewListRequest = async () => {
    const responseBody = await axios.get(GET_REVIEW_POST_LIST_API_URL)
    .then(responseDataHandler<GetReviewPostListResponseDto>)
    .catch(responseErrorHandler);
return responseBody;
};

// function: 후기 게시글 가져오기 요청 함수 //
export const getReviewPostRequest = async (reviewId: string | number) => {
    const responseBody = await axios.get(GET_REVIEW_POST_API_URL(reviewId))
        .then(responseDataHandler<GetReviewResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 후기 게시글 좋아요 요청 함수 //
export const postReviewLikeRequest = async(reviewId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_REVIEW_LIKE_API_URL(reviewId), {}, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 후기 게시글 삭제 요청 함수 //
export const deleteReviewPostRequest = async (reviewId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_REVIEW_POST_API_URL(reviewId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 후기 게시글 수정 요청 함수 //
export const patchReviewPostRequest = async (requestBody: PatchReviewPostRequestDto, reviewId: string | number,  accessToken: string) => {
    const responseBody = await axios.patch(PATCH_REVIEW_POST_API_URL(reviewId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 랜덤 작성 요청 함수 //
export const postMyRandomRequest = async (requestBody: PostRouletteRequestDto, accessToken: string) => {
    const repsonseBody = await axios.post(POST_MY_RANDOM_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return repsonseBody;
}

// function: 랜덤 삭제 요청 함수 //
export const deleteMyRandomRequest = async (randomId: string | number, accessToken: string) => {
    const repsonseBody = await axios.delete(DELETE_MY_RANDOM_API_URL(randomId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return repsonseBody;
}

// function: 내 랜덤 이력 불러오기 요청 함수 //
export const getMyRandomListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_MY_RANDOM_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetRouletteListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 지역 추가 요청 함수 //
export const postAreaRequest = async (requestBody: PostAreaRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_AREA_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 관광지 추가 요청 함수 //
export const postAttractionRequest = async (requestBody: PostAttractionRequestDto, areaId: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_ATTRACTION_API_URL(areaId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 먹거리 추가 요청 함수 //
export const postFoodRequest = async (requestBody: PostFoodRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_FOOD_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 후기 댓글 리스트 가져오기 요청 함수 //
export const getReviewCommentListRequest = async (reviewId: string | number) => {
    const responseBody = await axios.get(GET_REVIEW_COMMENT_LIST_API_URL(reviewId))
    .then(responseDataHandler<GetReviewCommentListResponseDto>)
    .catch(responseErrorHandler);
return responseBody;
};

// function: 후기 댓글 리스트 가져오기 요청 함수 //
export const getReviewCommentRequest = async (reviewId: string | number, reviewCommentId: string | number) => {
    const responseBody = await axios.get(GET_REVIEW_COMMENT_API_URL(reviewId, reviewCommentId))
    .then(responseDataHandler<GetReviewCommentResponseDto>)
    .catch(responseErrorHandler);
return responseBody;
};

// function: 후기 게시글 작성 요청 함수 //
export const postReviewCommentRequest = async (requestBody: PostReviewCommentRequestDto, reviewId: string | number, accessToken: string) => {
    const responseBody = await axios.post(POST_REVIEW_COMMENT_API_URL(reviewId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: 후기 게시글 수정 요청 함수 //
export const patchReviewCommentRequest = async (requestBody: PatchReviewCommentRequestDto, reviewId: string | number, reviewCommentId: string | number, accessToken: string) => {
    const responseBody = await axios.patch(UPDATE_REVIEW_COMMENT_API_URL(reviewId, reviewCommentId), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 후기 댓글 삭제 요청 함수 //
export const deleteReviewCommentRequest = async (reviewId: string | number, reviewCommentId: string | number, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_REVIEW_COMMENT_API_URL(reviewId, reviewCommentId), bearerAuthorization(accessToken))
    .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 미션 추가 요청 함수 //
export const postMissionRequest = async (requestBody: PostMissionRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_MISSION_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: 지역 추가 요청 함수 //
export const deleteAreaRequest = async (areaId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_AREA_API_URL(areaId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

export const deleteAttractionRequest = async (areaId: number | string, attractionId: number | string ,accessToken: string) => {
    const responseBody = await axios.delete(DELETE_ATTRACTION_API_URL(areaId,attractionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

export const deleteFoodRequest = async (foodId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_FOOD_API_URL(foodId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

export const deleteMissionRequest = async (missionId: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_MISSION_API_URL(missionId), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}