import React, { useEffect, useState } from 'react'
import './style.css';

import { GetAreaResponseDto } from '../../apis/dto/response/area';
import { ResponseDto } from '../../apis/dto/response';
import { Area, Attraction, Mission } from '../../types';
import { getAreaListRequest, getAttractionListRequest, getFoodListRequest, getMissionListRequest } from '../../apis/dto/request';
import { GetAttractionResponseDto } from '../../apis/dto/response/attraction';
import { motion } from 'framer-motion';
import Food from 'types/food-get.interface';
import { GetFoodResponseDto } from 'apis/dto/response/food';
import GetMissionResponseDto from 'apis/dto/response/mission/get-mission.response.dto';
import { postMyRandomRequest } from 'apis';
import { PostRouletteRequestDto } from 'apis/dto/request/roulette';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN } from '../../constants';

interface SlotReelProps {
    values: string[]; // 릴의 항목들
    spinning: boolean;
    speed: number; // 회전 속도
    delay: number; // 애니메이션 지연
}

function SlotReel({ values, spinning, speed, delay }: SlotReelProps) {
    return (
        <div className="reel">
            <motion.div
                className="reel-numbers"
                animate={spinning ? { y: [-1500, 0] } : { y: 0 }}
                transition={{
                    duration: speed,
                    delay: delay,
                    ease: "easeInOut",
                }}
            >
                {values.map((value, index) => (
                    <div className="reel-item" key={index}>
                        {value}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function Main() {
    
    const [spinning, setSpinning] = useState(false);
    const [results, setResults] = useState<string[][]>([]);
    const [speeds, setSpeeds] = useState<number[]>([]);
    const [delays, setDelays] = useState<number[]>([]);

    const [areaNames, setAreaNames] = useState<string[]>([]);
    const [attractionNames, setAttractionNames] = useState<string[]>([]);
    const [foodNames, setFoodNames] = useState<string[]>([]);
    const [missionNames, setMissionNames] = useState<string[]>([]);

      // state: 원본 리스트 상태 //
    const [areaList, setArealList] = useState<Area[]>([]);
    const [attractionList, setAttractionList] = useState<Attraction[]>([]);
    const [foodList, setFoodList] = useState<Food[]>([]);
    const [missionList, setMissionList] = useState<Mission[]>([]);
    const [areaAttractionsMap, setAreaAttractionsMap] = useState<Map<number, string[]>>(new Map());

    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

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
        setArealList(areas);
        setAreaNames(areas.map((area) => area.areaName));
    }

    const getAttractionListResponse = (responseBody: GetAttractionResponseDto | ResponseDto | null) => {
        const message =
            !responseBody
                ? '서버에 문제가 있습니다.' : responseBody.code === 'VF'
                ? '잘못된 접근입니다.' : responseBody.code === 'AF'
                ? '잘못된 접근입니다.' : responseBody.code === 'DBE'
                ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { attractions } = responseBody as GetAttractionResponseDto;
        setAttractionList(attractions);

        // areaId별 attractionName 리스트 맵핑
        const areaAttractions = new Map<number, string[]>();
        attractions.forEach((attraction) => {
            const areaId = attraction.areaId; // areaId는 number 타입
            const attractionName = attraction.attractionName;
            if (!areaAttractions.has(areaId)) {
                areaAttractions.set(areaId, []);
            }
            areaAttractions.get(areaId)?.push(attractionName);
        });

        setAreaAttractionsMap(areaAttractions);
        setAttractionNames(attractions.map((attraction) => attraction.attractionName));
    };

    const getFoodListResponse = (responseBody: GetFoodResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { foods } = responseBody as GetFoodResponseDto;
        setFoodList(foods);
        setFoodNames(foods.map((food) => food.foodName));
    }

    const getMissionListResponse = (responseBody: GetMissionResponseDto | ResponseDto | null) => {
        const message = !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
    
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { missions } = responseBody as GetMissionResponseDto;
        setMissionList(missions);
        setMissionNames(missions.map((mission) => mission.missionName));
    }

    const postMyRandomResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 값입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 아이디입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const getAreaNames = () => {
        getAreaListRequest().then(getAreaListResponse);
    };

    const getAttractionNames = () => {
        getAttractionListRequest().then(getAttractionListResponse);
    };

    const getFoodNames = () => {
        getFoodListRequest().then(getFoodListResponse);
    };

    const getMissionNames = () => {
        getMissionListRequest().then(getMissionListResponse);
    };

    useEffect(() => {
        getAreaNames();
        getAttractionNames();
        getFoodNames();
        getMissionNames();
    }, []);

    // 각 릴의 데이터
    // const regions = ['서울', '부산', '제주', '광주', '대구'];
    // const attractions = ['경복궁', '부산타워', '한라산', '전주한옥마을', '대구엑스코'];
    // const foods = ['김밥', '치킨', '비빔밥', '떡볶이', '순두부찌개'];
    // const missions = ['사진 찍기', '음식 먹기', '기념품 사기', '무지개 찾기', '명소 방문하기'];

    const handleSpin = () => {
        setSpinning(true);

        // 각 릴의 속도와 지연 시간 설정
        const newSpeeds = Array(4).fill(0).map(() => Math.random() * 2 + 1);
        const newDelays = Array(4).fill(0).map(() => Math.random() * 1);

        setSpeeds(newSpeeds);
        setDelays(newDelays);

        const areaResults = areaNames.sort(() => Math.random() - 0.5).slice(0, 5);

        const attractionResults = areaResults.map((areaName) => {
            const area = areaList.find((a) => a.areaName === areaName);
            if (area) {
                const attractionNamesForArea = areaAttractionsMap.get(area.areaId) || [];
                // attractionNamesForArea에서 랜덤하게 선택
                return attractionNamesForArea.sort(() => Math.random() - 0.5).slice(0, 5);
            }
            return [];
        });

        const foodResults = foodNames.sort(() => Math.random() - 0.5).slice(0, 5);
        const missionResults = missionNames.sort(() => Math.random() - 0.5).slice(0, 5);

        // 각 릴의 내용을 랜덤하게 설정
        const newResults = [
            areaResults, // 첫 번째 룰렛: areaNames
            attractionResults.flat(), // 두 번째 룰렛: 선택된 area의 attractionNames
            foodResults.sort(() => Math.random() - 0.5).slice(0, 5),
            missionResults.sort(() => Math.random() - 0.5).slice(0, 5),
        ];

        // 결과를 즉시 업데이트하여 애니메이션 시작 전에 표시
        setResults(newResults);

        // 가장 긴 속도와 지연을 기준으로 총 애니메이션 지속 시간 계산
        const totalDuration = Math.max(...newSpeeds) * 1000 + Math.max(...newDelays) * 1000;

        if (accessToken) {
            const requestBody: PostRouletteRequestDto = {
                areaName: newResults[0][0], attractionName: newResults[1][0], foodName: newResults[2][0], missionName: newResults[3][0]
            }
    
            postMyRandomRequest(requestBody, accessToken).then(postMyRandomResponse);
        }

        // 애니메이션이 끝난 후 스피닝 상태를 false로 설정
        setTimeout(() => {
            setSpinning(false);
        }, totalDuration);
    };

    useEffect(() => {

    }, [])

    return (
        <div id="main-wrapper">
            <div className='main'>
                <div className='comment'>어딘가로 떠나고 싶지만</div>
                <div className='comment'>어디로 가야할지 모르시겠나요?</div>
                <div className='main-bottom'>
                    <div className="reels">
                        {results.map((values, index) => (
                            <SlotReel
                                key={index}
                                values={values}
                                spinning={spinning}
                                speed={speeds[index] || 1.5}
                                delay={delays[index] || 0}
                            />
                        ))}
                    </div>
                    <button onClick={handleSpin} disabled={spinning}>
                        클릭!
                    </button>
                </div>
            </div>
        </div>
    );
}