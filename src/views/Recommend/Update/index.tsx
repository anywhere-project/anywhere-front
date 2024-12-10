import { useNavigate, useParams } from 'react-router-dom';
import { useSignInUserStore } from '../../../stores';
import './style.css';
import { useCookies } from 'react-cookie';
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto } from '../../../apis/dto/request/recommend';
import { patchRecommendAttractionRequest, patchRecommendMissionRequest } from '../../../apis';
import { ResponseDto } from '../../../apis/dto/response';
import { useState } from 'react';
import { ACCESS_TOKEN } from '../../../constants';

export default function RecommendUpdate() {
    
    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: 게시글 번호 경로 변수 상태 //
    const { recommendId } = useParams();

    // state: 추천 게시글 상태 //
    const [attractionName, setAttractionName] = useState('');
    const [attractionAddress, setAttractionAddress] = useState('');
    const [attractionContent, setAttractionContent] = useState('');

    const [foodName, setFoodName] = useState('');
    const [foodContent, setFoodContent] = useState('');

    const [missionName, setMissionName] = useState('');
    const [missionContent, setMissionContent] = useState('');

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 추천 관광지 작성 처리 함수 //
    const patchRecommendAttractionResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    // function: 추천 미션 작성 처리 함수 //
    const patchRecommendMissionResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    };

    // function: 추천 먹거리 작성 처리 함수 //
    const patchRecommendFoodResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    };

    // const onAttractionButtonClickHandler = () => {
    //     if (!attractionName || !attractionAddress || !attractionContent) return;

    //     const accessToken = cookies[ACCESS_TOKEN];
    //     if (!accessToken || !recommendId) return;

    //     const requestBody: PatchRecommendAttractionRequestDto = {
    //         attractionName, attractionAddress, attractionContent
    //     }

    //     patchRecommendAttractionRequest(requestBody, recommendId, accessToken).then(patchRecommendAttractionResponse);
    // }

    // const onFoodButtonClickHandler = () => {
    //     if (!foodName || !foodContent) return;

    //     const accessToken = cookies[ACCESS_TOKEN];
    //     if (!accessToken || !recommendId) return;

    //     const requestBody: PatchRecommendFoodRequestDto = {
    //         foodName, foodContent
    //     }
        
    //     postRecommendFoodRequest(requestBody, recommendId, accessToken).then(patchRecommendFoodResponse);
    // }

    // const onMissionButtonClickHandler = () => {
    //     if (!missionName || !missionContent) return;

    //     const accessToken = cookies[ACCESS_TOKEN];
    //     if (!accessToken || !recommendId) return;

    //     const requestBody: PatchRecommendMissionRequestDto = {
    //         missionName, missionContent
    //     }

    //     patchRecommendMissionRequest(requestBody, recommendId, accessToken).then(patchRecommendMissionResponse);
    // }

    return (
        <></>
    );

}