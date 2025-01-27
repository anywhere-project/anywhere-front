import React, { useEffect, useState } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';
import {
    deleteAreaRequest,
    deleteAttractionRequest,
    deleteFoodRequest,
    deleteMissionRequest,
} from 'apis';
import { ACCESS_TOKEN } from '../../constants';
import { getAreaListRequest, getAttractionListRequest, getFoodListRequest, getMissionListRequest } from 'apis/dto/request';
import { GetAreaResponseDto } from 'apis/dto/response/area';
import { GetAttractionResponseDto } from 'apis/dto/response/attraction';
import { GetFoodResponseDto } from 'apis/dto/response/food';
import { GetMissionResponseDto } from 'apis/dto/response/mission';

export default function RouletteDel() {
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // 상태 관리
    const [selectCategory, setSelectCategory] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [selectItemId, setSelectItemId] = useState<number | null>(null);

    // 카테고리 선택 핸들러
    const categoryClickHandler = async (category: string) => {
        setSelectCategory(category);
        setItems([]); // 초기화
        setSelectItemId(null);

        // 선택된 카테고리의 데이터 불러오기
        try {
            switch (category) {
                case '지역':
                    const areaResponse = await getAreaListRequest();
                    if (areaResponse && areaResponse.code === 'SU') {
                        const { areas } = areaResponse as GetAreaResponseDto;
                        setItems(
                            areas.map((area) => ({
                                id: area.areaId,
                                name: area.areaName,
                            }))
                        );
                    } else {
                        throw new Error('지역 데이터를 불러오지 못했습니다.');
                    }
                    break;

                case '관광지':
                    const attractionResponse = await getAttractionListRequest();
                    if (attractionResponse && attractionResponse.code === 'SU') {
                        const { attractions } = attractionResponse as GetAttractionResponseDto;
                        setItems(
                            attractions.map((attraction) => ({
                                id: attraction.attractionId,
                                name: `${attraction.attractionName}`,
                            }))
                        );
                    }
                    break;

                case '먹거리':
                    const foodResponse = await getFoodListRequest();
                    if (foodResponse && foodResponse.code === 'SU') {
                        const { foods } = foodResponse as GetFoodResponseDto;
                        setItems(
                            foods.map((food) => ({
                                id: food.foodId,
                                name: food.foodName,
                            }))
                        );
                    }
                    break;

                case '미션':
                    const missionResponse = await getMissionListRequest();
                    if (missionResponse && missionResponse.code === 'SU') {
                        const { missions } = missionResponse as GetMissionResponseDto;
                        setItems(
                            missions.map((mission) => ({
                                id: mission.missionId,
                                name: mission.missionName,
                            }))
                        );
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            alert('데이터를 불러오는데 실패했습니다.');
        }
    };

    // 삭제 버튼 클릭 핸들러
    const deleteClickHandler = async () => {
        if (!selectItemId) {
            alert('삭제할 항목을 선택하세요.');
            return;
        }

        try {
            switch (selectCategory) {
                case '지역':
                    await deleteAreaRequest(selectItemId, accessToken);
                    alert('지역이 성공적으로 삭제되었습니다.');
                    break;
                case '관광지':
                    const areaId = 1; // 예시로 지역 ID를 사용
                    await deleteAttractionRequest(areaId, selectItemId, accessToken);
                    alert('관광지가 성공적으로 삭제되었습니다.');
                    break;
                case '먹거리':
                    await deleteFoodRequest(selectItemId, accessToken);
                    alert('먹거리가 성공적으로 삭제되었습니다.');
                    break;
                case '미션':
                    await deleteMissionRequest(selectItemId, accessToken);
                    alert('미션이 성공적으로 삭제되었습니다.');
                    break;
                default:
                    alert('카테고리를 선택하세요.');
            }
            
            await categoryClickHandler(selectCategory!);
            setSelectItemId(null);
        } catch (error: any) {
            alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    return (
        <div id='RouletteDel-wrapper'>
            <div className='button-container'>
                <div
                    className={`area-button ${selectCategory === '지역' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('지역')}
                >
                    지역
                </div>
                <div
                    className={`attraction-button ${selectCategory === '관광지' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('관광지')}
                >
                    관광지
                </div>
                <div
                    className={`food-button ${selectCategory === '먹거리' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('먹거리')}
                >
                    먹거리
                </div>
                <div
                    className={`mission-button ${selectCategory === '미션' ? 'active' : ''}`}
                    onClick={() => categoryClickHandler('미션')}
                >
                    미션
                </div>
            </div>
            <div className='input-container'>
                {!selectCategory ?
                    (<select className="dropdown" disabled>
                        <option value="">카테고리를 선택하여주세요.</option>
                    </select>
                    ) :
                    items.length > 0 ? (
                        <select
                            className='dropdown'
                            value={selectItemId || ''}
                            onChange={(e) => setSelectItemId(Number(e.target.value))}
                        >
                            <option value=''>삭제할 항목을 선택하세요.</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <select className='dropdown'>
                            <option value=''>선택한 카테고리에 항목이 없습니다.</option>
                        </select>
                    )}

                <div className='delete-button' onClick={deleteClickHandler}>
                    삭제
                </div>
            </div>
        </div>
    );
}
