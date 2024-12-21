import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ResponseDto } from 'apis/dto/response';
import { deleteRecommendAttractionRequest, deleteRecommendFoodRequest, deleteRecommendMissionRequest, fileUploadRequest, getRecommendAttractionListRequest, getRecommendFoodListRequest, getRecommendMissionListRequest, getRecommendPostRequest, patchRecommendAttractionRequest, patchRecommendFoodRequest, patchRecommendMissionRequest, patchRecommendPostRequest, postRecommendFoodRequest, postRecommendMissionRequest } from 'apis';
import { ACCESS_TOKEN, RECOMMEND_PATH } from '../../../constants';
import { GetRecommendAttractionListResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto, GetRecommendPostResponseDto } from 'apis/dto/response/recommend';
import './style.css';
import { RecommendAttraction, RecommendFood, RecommendImage, RecommendMission } from 'types';
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostRecommendFoodRequestDto, PostRecommendMissionRequestDto } from 'apis/dto/request/recommend';

interface Attractions {
    recommendAttraction: RecommendAttraction;
}

interface Foods {
    recommendFood: RecommendFood;
}

interface Missions {
    recommendMission: RecommendMission;
}

function AttractionRow({ recommendAttraction }: Attractions) {

    // state: 게시글 번호 경로 변수 상태 //
    const { recommendId } = useParams();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    const accessToken = cookies[ACCESS_TOKEN];

    const [attractionFields, setAttractionFields] = useState([
        { 
            attractionName: recommendAttraction.attractionName, 
            attractionAddress: recommendAttraction.attractionAddress, 
            attractionContent: recommendAttraction.attractionContent,
            isEditable: false
        },
    ]);

    const deleteRecommendAttractionResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const patchRecommendAttractionResponse = (responseBody: ResponseDto | null,  index: number) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        toggleEditState(index);
    }

    const handleAttractionChange = (index: number, field: 'attractionName' | 'attractionAddress' | 'attractionContent', value: string) => {
        const updatedFields = [...attractionFields];
        updatedFields[index][field] = value;
        setAttractionFields(updatedFields);
    };

    const toggleEditState = (index: number) => {
        setAttractionFields((prevFields) =>
            prevFields.map((field, i) =>
                i === index ? { ...field, isEditable: !field.isEditable } : field
            )
        );
    };

    const onDeleteButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        deleteRecommendAttractionRequest(recommendId, recommendAttraction.attractionId, accessToken).then(deleteRecommendAttractionResponse);
    }

    const onUpdateButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        const { attractionName, attractionAddress, attractionContent } = attractionFields[index];

        if (!attractionAddress || !attractionName || !attractionContent) {
            alert('내용을 입력해주세요.');
            return;
        }

        const requestBody: PatchRecommendAttractionRequestDto = {
            attractionName,
            attractionAddress,
            attractionContent
        };

        patchRecommendAttractionRequest(requestBody, recommendId, recommendAttraction.attractionId, accessToken)
            .then((responseBody) => patchRecommendAttractionResponse(responseBody, index));
    };

    return (
        <div>
            {attractionFields.map((field, index) => (
                <div key={index} className="attraction-field box-container">
                    <div
                        className="remove-field-btn"
                        onClick={() => onDeleteButtonClickHandler(index)}
                    >
                        ×
                    </div>
                    <div className="box">
                        <div className="field-content">
                            <input
                                type="text"
                                placeholder="관광지 이름"
                                value={field.attractionName}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleAttractionChange(index, 'attractionName', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="관광지 주소"
                                value={field.attractionAddress}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleAttractionChange(index, 'attractionAddress', e.target.value)}
                            />
                            <textarea
                                placeholder="관광지 설명"
                                value={field.attractionContent}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleAttractionChange(index, 'attractionContent', e.target.value)}
                            />
                        </div>
                        <div className="update-field-btn" onClick={() => (field.isEditable ? onUpdateButtonClickHandler(index) : toggleEditState(index))}>
                            {field.isEditable ? "저장" : "✏️"}
                        </div>                    
                    </div>
                </div>
            ))}
        </div>
    );

}

function FoodRow({ recommendFood }: Foods) {
    // state: 게시글 번호 경로 변수 상태
    const { recommendId } = useParams();

    // state: cookie 상태
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 추천 음식 상태
    const [foodFields, setFoodFields] = useState([
        { 
            foodName: recommendFood.foodName, 
            foodContent: recommendFood.foodContent, 
            isNew: false 
        }
    ]);

    const postRecommendFoodResponse = (responseBody: ResponseDto | null) => {
        const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const deleteRecommendFoodResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const patchRecommendFoodResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const onFoodNameChangeHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFields = [...foodFields];
        updatedFields[index].foodName = event.target.value;
        setFoodFields(updatedFields);
    };

    const onFoodDescriptionChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const updatedFields = [...foodFields];
        updatedFields[index].foodContent = event.target.value;
        setFoodFields(updatedFields);
    };

    const onDeleteButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        if (foodFields[index].isNew) {
            setFoodFields(foodFields.filter((_, i) => i !== index));
        } else {
            deleteRecommendFoodRequest(recommendId, recommendFood.foodId, accessToken).then(deleteRecommendFoodResponse);
        }
    };

    const onUpdateButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        const { foodName, foodContent } = foodFields[index];

        if (!foodName || !foodContent) {
            alert('내용을 입력해주세요.');
            return;
        }

        const requestBody: PatchRecommendFoodRequestDto = {
            foodName,
            foodContent,
        };

        patchRecommendFoodRequest(requestBody, recommendId, recommendFood.foodId, accessToken).then(patchRecommendFoodResponse);
    };

    const onPostButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        const { foodName, foodContent } = foodFields[index];

        if (!foodName || !foodContent) {
            alert('내용을 입력해주세요.');
            return;
        }

        const requestBody: PostRecommendFoodRequestDto = {
            foodName,
            foodContent
        };

        postRecommendFoodRequest(requestBody, recommendId, accessToken).then(postRecommendFoodResponse);
    };

    return (
        <div className="recommend-update">
            {foodFields.map((field, index) => (
                <div className="food-field box-container" key={index}>
                    <div className="box">
                        <div className="field-content">
                            <input
                                type="text"
                                placeholder="음식 이름"
                                value={field.foodName}
                                onChange={(e) => onFoodNameChangeHandler(e, index)}
                            />
                            <textarea
                                placeholder="음식 설명"
                                value={field.foodContent}
                                onChange={(e) => onFoodDescriptionChangeHandler(e, index)}
                            />
                        </div>
                        <div className="button-group">
                            <button
                                className="delete-button"
                                onClick={() => onDeleteButtonClickHandler(index)}
                            >
                                x
                            </button>
                            {!field.isNew && (
                                <button
                                    className="update-button"
                                    onClick={() => onUpdateButtonClickHandler(index)}
                                >
                                    수정
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function MissionRow({ recommendMission }: Missions) {
    // state: 게시글 번호 경로 변수 상태
    const { recommendId } = useParams();

    // state: cookie 상태
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 추천 미션 상태
    const [missionFields, setMissionFields] = useState([
        { 
            missionName: recommendMission.missionName, 
            missionContent: recommendMission.missionContent,
            isNew: false 
        }
    ]);

    const postRecommendMissionResponse = (responseBody: ResponseDto | null) => {
        const message =
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'VF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const deleteRecommendMissionResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const patchRecommendMissionResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    // 미션 이름 변경 핸들러
    const onMissionNameChangeHandler = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedFields = [...missionFields];
        updatedFields[index].missionName = event.target.value;
        setMissionFields(updatedFields);
    };

    // 미션 설명 변경 핸들러
    const onMissionDescriptionChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const updatedFields = [...missionFields];
        updatedFields[index].missionContent = event.target.value;
        setMissionFields(updatedFields);
    };

    // 미션 삭제 버튼 핸들러
    const onDeleteButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        if (missionFields[index].isNew) {
            setMissionFields(missionFields.filter((_, i) => i !== index));
        } else {
            deleteRecommendMissionRequest(recommendId, recommendMission.missionId, accessToken).then(deleteRecommendMissionResponse);
        }
    };

    // 미션 수정 버튼 핸들러
    const onUpdateButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        const { missionName, missionContent } = missionFields[index];

        if (!missionName || !missionContent) {
            alert('내용을 입력해주세요.');
            return;
        }

        const requestBody: PatchRecommendMissionRequestDto = {
            missionName,
            missionContent,
        };

        patchRecommendMissionRequest(requestBody, recommendId, recommendMission.missionId, accessToken).then(patchRecommendMissionResponse);
    };

    // 미션 작성 버튼 핸들러
    const onPostButtonClickHandler = (index: number) => {
        if (!accessToken || !recommendId) return;

        const { missionName, missionContent } = missionFields[index];

        if (!missionName || !missionContent) {
            alert('내용을 입력해주세요.');
            return;
        }

        const requestBody: PostRecommendMissionRequestDto = {
            missionName,
            missionContent,
        };

        postRecommendMissionRequest(requestBody, recommendId, accessToken).then(postRecommendMissionResponse);
    };

    return (
        <div className="recommend-update">
            {missionFields.map((field, index) => (
                <div className="mission-field box-container" key={index}>
                    <div className="box">
                        <div className="field-content">
                            <input
                                type="text"
                                placeholder="미션 이름"
                                value={field.missionName}
                                onChange={(e) => onMissionNameChangeHandler(e, index)}
                            />
                            <textarea
                                placeholder="미션 설명"
                                value={field.missionContent}
                                onChange={(e) => onMissionDescriptionChangeHandler(e, index)}
                            />
                        </div>
                        <div className="button-group">
                            <button
                                className="delete-button"
                                onClick={() => onDeleteButtonClickHandler(index)}
                            >
                                x
                            </button>
                            {!field.isNew && (
                                <button
                                    className="update-button"
                                    onClick={() => onUpdateButtonClickHandler(index)}
                                >
                                    수정
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RecommendUpdate() {

    const { recommendId } = useParams();
    
    const [cookies] = useCookies();

    // state: 추천 게시글 상태 //
    const [category, setCategory] = useState<string>('');
    const [attractions, setAttractions] = useState<RecommendAttraction[]>([]);
    const [foods, setFoods] = useState<RecommendFood[]>([]);
    const [missions, setMissions] = useState<RecommendMission[]>([]);
    const [images, setImages] = useState<RecommendImage[]>([]);

    const [foodFields, setFoodFields] = useState([{ foodName: '', foodContent: '' }]);
    const [missionFields, setMissionFields] = useState([{ missionName: '', missionContent: '' }]);
    const [attractionFields, setAttractionFields] = useState([{ attractionName: '', attractionAddress: '', attractionContent: '' }]);

    const [imageOrder, setImageOrder] = useState<number[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    const accessToken = cookies[ACCESS_TOKEN];

    // functoin: 추천 게시글 수정 요청 함수 //
    const patchRecommendPostResponse = (responseBody: ResponseDto | null) => {
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

        alert('수정 완료!');
        navigator(RECOMMEND_PATH);
    };

    const getRecommendPostResponse = (responseBody: GetRecommendPostResponseDto | ResponseDto | null) => {
        const message =     
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { recommendCategory } = responseBody as GetRecommendPostResponseDto;
        setCategory(recommendCategory);
    }

    // function: 추천 관광지 가져오기 요청 함수 //
    const getRecommendAttractionListResponse = (responseBody: GetRecommendAttractionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { attractions } = responseBody as GetRecommendAttractionListResponseDto;
        setAttractions(attractions);
    }

    // function: 추천 먹거리 가져오기 요청 함수 //
    const getRecommendFoodListResponse = (responseBody: GetRecommendFoodListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRF' ? '존재하지 않는 먹거리입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { foods } = responseBody as GetRecommendFoodListResponseDto;
        setFoods(foods);
    }

    // function: 추천 미션 가져오기 요청 함수 //
    const getRecommendMissionListResponse = (responseBody: GetRecommendMissionListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRF' ? '존재하지 않는 먹거리입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { missions } = responseBody as GetRecommendMissionListResponseDto;
        setMissions(missions);
    }

    const handleMissionChange = (index: number, field: keyof PostRecommendMissionRequestDto, value: string) => {
        const updatedFields = [...missionFields];
        updatedFields[index][field] = value;
        setMissionFields(updatedFields);
    };

    const handleAddMissionField = () => {
        setMissionFields([...missionFields, { missionName: '', missionContent: '' }]);
    };

    const handleRemoveMissionField = (index: number) => {
        const updatedFields = missionFields.filter((_, i) => i !== index);
        setMissionFields(updatedFields);
    };

    const handleFoodChange = (index: number, field: 'foodName' | 'foodContent', value: string) => {
        const updatedFields = [...foodFields];
        updatedFields[index][field] = value;
        setFoodFields(updatedFields);
    };

    const handleAddFoodField = () => {
        setFoodFields([...foodFields, { foodName: '', foodContent: '' }]);
    };

    const handleRemoveFoodField = (index: number) => {
        const updatedFields = foodFields.filter((_, i) => i !== index);
        setFoodFields(updatedFields);
    };

    const handleAttractionChange = (index: number, field: 'attractionName' | 'attractionAddress' | 'attractionContent', value: string) => {
        const updatedFields = [...attractionFields];
        updatedFields[index][field] = value;
        setAttractionFields(updatedFields);
    };

    const handleAddAttractionField = () => {
        setAttractionFields([...attractionFields, { attractionName: '', attractionAddress: '', attractionContent: '' }]);
    };

    const handleRemoveAttractionField = (index: number) => {
        const updatedFields = attractionFields.filter((_, i) => i !== index);
        setAttractionFields(updatedFields);
    };

    //  event handler: 추천 게시글 수정 버튼 클릭 핸들러 //
    const onPatchButtonClickHandler = async () => {
        if (!accessToken || !recommendId) return;
    
        const uploadedImages = [];
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            const uploadedImage = await fileUploadRequest(formData, accessToken);
            if (uploadedImage) uploadedImages.push(uploadedImage);
        }

        const requestBody: PatchRecommendPostRequestDto = {
            foods: category === 'food' ? foodFields : null,
            missions: category === 'mission' ? missionFields : null,
            attractions: category === 'attraction' ? attractionFields : null,
            images: uploadedImages.map((url, index) => ({ imageOrder: index, imageUrl: url })),
        }

        patchRecommendPostRequest(requestBody, recommendId, category, accessToken).then(patchRecommendPostResponse);
    };
    
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newPreviews = [...previews];
        const newImages = [...imageFiles, ...files];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                setPreviews(newPreviews);
                setImageFiles(newImages);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageRemove = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (!recommendId) return;
    
        getRecommendPostRequest(recommendId).then(getRecommendPostResponse);
    
        switch (category) {
            case 'attraction':
                getRecommendAttractionListRequest(recommendId).then(getRecommendAttractionListResponse);
                break;
            case 'food':
                getRecommendFoodListRequest(recommendId).then(getRecommendFoodListResponse);
                break;
            case 'mission':
                getRecommendMissionListRequest(recommendId).then(getRecommendMissionListResponse);
                break;
        }
    }, [recommendId, category]);
    

    return (
        <div className="recommend-update">

            {category === 'attraction' && (
                <div>
                    {attractions.map((attraction, index) => (
                        <div className="attractionRow" key={index}>
                            <AttractionRow recommendAttraction={attraction} />
                        </div>
                    ))}

                    {attractionFields.map((field, index) => (
                        <div key={index} className="attraction-field box-container">
                            <div
                                className="remove-field-btn"
                                onClick={() => handleRemoveAttractionField(index)}
                            >
                                ×
                            </div>
                            <div className="box">
                                <div className="field-content">
                                    <input
                                        type="text"
                                        placeholder="관광지 이름"
                                        value={field.attractionName}
                                        onChange={(e) => handleAttractionChange(index, 'attractionName', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="관광지 주소"
                                        value={field.attractionAddress}
                                        onChange={(e) => handleAttractionChange(index, 'attractionAddress', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="관광지 설명"
                                        value={field.attractionContent}
                                        onChange={(e) => handleAttractionChange(index, 'attractionContent', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='attraction-field add-button' onClick={handleAddAttractionField}>+</div>
                </div>
            )}


            {category === 'food' && (
                <div>
                    {foods.map((food, index) => (
                        <div className="foodRow" key={index}>
                            <FoodRow recommendFood={food} />
                        </div>
                    ))}

                    {foodFields.map((field, index) => (
                        <div key={index} className="food-field box-container">
                            <div
                                className="remove-field-btn"
                                onClick={() => handleRemoveFoodField(index)}
                            >
                                ×
                            </div>
                            <div className="box">
                                <div className="field-content">
                                    <input
                                        type="text"
                                        placeholder="음식 이름"
                                        value={field.foodName}
                                        onChange={(e) => handleFoodChange(index, 'foodName', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="음식 설명"
                                        value={field.foodContent}
                                        onChange={(e) => handleFoodChange(index, 'foodContent', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='food-field add-button' onClick={handleAddFoodField}>+</div>
                </div>
            )}

            {category === 'mission' && (
                <div>
                    {missions.map((mission, index) => (
                        <div className="missionRow" key={index}>
                            <MissionRow recommendMission={mission} />
                        </div>
                    ))}

                    {missionFields.map((field, index) => (
                        <div key={index} className="mission-field box-container">
                            <div
                                className="remove-field-btn"
                                onClick={() => handleRemoveMissionField(index)}
                            >
                                ×
                            </div>
                            <div className="box">
                                <div className="field-content">
                                    <input
                                        type="text"
                                        placeholder="미션 이름"
                                        value={field.missionName}
                                        onChange={(e) =>
                                            handleMissionChange(index, 'missionName', e.target.value)
                                        }
                                    />
                                    <textarea
                                        placeholder="미션 내용"
                                        value={field.missionContent}
                                        onChange={(e) =>
                                            handleMissionChange(index, 'missionContent', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mission-field add-button" onClick={handleAddMissionField}>+</div>
                </div>
            )}

            <div className="image-uploader">
                <input
                    type="file"
                    multiple
                    ref={imageInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <div onClick={() => imageInputRef.current?.click()} className="upload-button">이미지 업로드</div>
                <div className="image-previews">
                    {previews.map((preview, index) => (
                        <div key={index} className="preview">
                            <img src={preview} alt={`preview-${index}`} />
                            <div className="remove-image-btn" onClick={() => handleImageRemove(index)}>×</div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="submit-button" onClick={onPatchButtonClickHandler}>게시물 수정</button>
        </div>
    );

}