export const ROOT_PATH = "/";

export const SIGN_UP_PATH = '/sign-up';

export const ACCESS_TOKEN = 'accessToken';

export const RECOMMEND_PATH = '/recommend';
export const RECOMMEND_CATEGORY_PATH = (category: string) => `${RECOMMEND_PATH}/${category}`;
export const RECOMMEND_UPDATE_PATH = (recommendId: string | number) => `${RECOMMEND_PATH}/update/${recommendId}`;
export const RECOMMEND_WRITE_PATH = `${RECOMMEND_PATH}/write`;

export const REVIEW_PATH = '/review';
export const REVIEW_WRITE_PATH = `${REVIEW_PATH}/write`;

export const MYPAGE_PATH = (userId: string) => `/mypage/${userId}`;

