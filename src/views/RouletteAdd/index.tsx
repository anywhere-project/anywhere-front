import React, { useEffect, useState } from 'react'
import './style.css';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../constants';
import { postAreaRequest, postAttractionRequest, postFoodRequest } from 'apis';
import { PostAreaRequestDto, PostAttractionRequestDto, PostFoodRequestDto } from 'apis/dto/request/roulette';
import { ResponseDto } from 'apis/dto/response';
import { GetAreaResponseDto } from 'apis/dto/response/area';
import { getAreaListRequest } from 'apis/dto/request';
import { Area } from 'types';

export default function RouletteAdd() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // variable: accessToken
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 카테고리와 입력값 상태 //
    const [selectCategory, setSelectCategory] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [addressValue, setAddressValue] = useState<string>('');
    const [attractionValue, setAttractionValue] = useState<string>('');
    const [areaList, setAreaList] = useState<Area[]>([]);
    const [selectAreaId, setSelectAreaId] = useState<number | null>(null);

    // event handler: 카테고리 버튼 클릭 이벤트 핸들러 //
    const categoryClickHandler = async (category: string) => {
        setSelectCategory(category);
        setInputValue('');
        setSelectAreaId(null);
    };

    useEffect(() => {
        const fetchAreaList = async () => {
            await getAreaListRequest().then(getAreaListResponse);
        };
        fetchAreaList();
    }, []);


    // function: 입력값 변경 함수 //
    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    const addressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressValue(e.target.value);
    }

    // function: 지역 response 함수 //
    const postAreaResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. 혹은 존재하는 지역인지 확인하세요.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        alert('성공적으로 지역을 저장하였습니다.');
    }

    // function: 지역 ID, 이름 불러오기 함수 //
    const getAreaListResponse = (responseBody: GetAreaResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { areas } = responseBody as GetAreaResponseDto;
        setAreaList(areas);
    }

    // function: 관광지 response 함수 //
    const postAttractionResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. 혹은 이미 존재하는 관광지인지 확인하세요.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        alert('성공적으로 관광지를 저장하였습니다.');
    };


    // function: 먹거리 response 함수 //
    const postFoodResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                    responseBody.code === 'VF' ? '잘못된 접근입니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. 혹은 존재하는 먹거리인지 확인하세요.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        alert('성공적으로 먹거리를 저장하였습니다.');
    }

    // event handler: 추가 버튼 클릭 이벤트 핸들러 //
    const addClickHandler = async () => {
        if (!inputValue.trim()) {
            alert('값을 입력하세요.');
            return;
        }

        if (!addressValue.trim()) {
            alert('값을 입력하세요.');
            return;
        }

        if (!selectAreaId) {
            alert('지역을 선택하세요.');
            return;
        }

        const requestBody = { name: inputValue };
        const AddressBody = { name: addressValue }

        switch (selectCategory) {
            case '지역':
                const areaRequestBody: PostAreaRequestDto = {
                    areaName: requestBody.name,
                };
                await postAreaRequest(areaRequestBody, accessToken).then(postAreaResponse);
                break;

            case '관광지':
                const attractionRequestBody: PostAttractionRequestDto = {
                    areaId: selectAreaId,
                    attractionName: requestBody.name,
                    attractionAddress: AddressBody.name,
                };
                console.log('Request Body:', attractionRequestBody, typeof(selectAreaId));
                await postAttractionRequest(attractionRequestBody, selectAreaId, accessToken).then(postAttractionResponse);
                break;

            case '먹거리':
                const foodRequestBody: PostFoodRequestDto = {
                    foodName: requestBody.name,
                };
                await postFoodRequest(foodRequestBody, accessToken).then(postFoodResponse);
                break;

            default:
                alert('카테고리를 선택하세요.');
                return;
        }
        setInputValue('');
    };

    return (
        <div id='RouletteAdd-wrapper'>
            <div className='button-container'>
                <div
                    className={`area-button ${selectCategory === '지역' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('지역')}
                >지역</div>
                <div
                    className={`attraction-button ${selectCategory === '관광지' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('관광지')}
                >관광지</div>
                <div
                    className={`food-button ${selectCategory === '먹거리' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('먹거리')}
                >먹거리</div>
                <div
                    className={`mission-button ${selectCategory === '미션' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('미션')}
                >미션</div>
            </div>
            <div className='input-container'>
                {selectCategory === '관광지' && (
                    <select
                    className='dropdown'
                    value={selectAreaId || ''}
                    onChange={(e) => setSelectAreaId(Number(e.target.value))}
                >
                    <option value=''>지역을 선택하세요</option>
                    {areaList.map((area) => (
                        <option key={area.areaId} value={area.areaId}>
                            {area.areaName}
                        </option>
                    ))}
                </select>
                )
                }
                <input
                    className='main-input'
                    value={inputValue}
                    onChange={inputChange}
                    placeholder={selectCategory ?
                        selectCategory === '관광지' || selectCategory === '먹거리'
                            ? `${selectCategory}를 입력하세요.`
                            : `${selectCategory}을 입력하세요.`
                        : '카테고리를 선택하세요.'}
                    disabled={!selectCategory}
                />
                {selectCategory === '관광지' && (
                    <input 
                    className='main-input'
                    value={addressValue}
                    onChange={addressChange}
                    placeholder={'주소를 입력하세요.'}
                    disabled={!selectCategory}
                    />
                )}
                <div className='add-button' onClick={addClickHandler}>추가</div>
            </div>
        </div>
    )
}
