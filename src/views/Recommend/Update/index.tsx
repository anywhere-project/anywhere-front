import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ResponseDto } from 'apis/dto/response';
import { deleteRecommendAttractionRequest, deleteRecommendFoodRequest, deleteRecommendMissionRequest, fileUploadRequest, getRecommendAttractionListRequest, getRecommendFoodListRequest, getRecommendMissionListRequest, getRecommendPostRequest, patchRecommendAttractionRequest, patchRecommendFoodRequest, patchRecommendMissionRequest, patchRecommendPostRequest } from 'apis';
import { ACCESS_TOKEN, RECOMMEND_PATH } from '../../../constants';
import { GetRecommendAttractionListResponseDto, GetRecommendFoodListResponseDto, GetRecommendMissionListResponseDto, GetRecommendPostResponseDto } from 'apis/dto/response/recommend';
import { AttractionImage, RecommendAttraction, RecommendFood, RecommendMission } from 'types';
import { PatchRecommendAttractionRequestDto, PatchRecommendFoodRequestDto, PatchRecommendMissionRequestDto, PatchRecommendPostRequestDto, PostAttractionImageRequestDto } from 'apis/dto/request/recommend';
import { deleteAttractionImageRequest, postAttractionImageRequest } from 'apis/dto/request';
import './style.css';

interface AttractionField {
    attractionName: string;
    attractionAddress: string;
    attractionContent: string;
    images: string[];
}

interface FoodField {
    foodName: string;
    foodContent: string;
    images: string[];
}

interface MissionField {
    missionName: string;
    missionContent: string;
    images: string[];
}

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

    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const imageInputRef = useRef<(HTMLInputElement | null)[]>([]);

    const [attractionFields, setAttractionFields] = useState([
        { 
            attractionId: recommendAttraction.attractionId,
            attractionName: recommendAttraction.attractionName, 
            attractionAddress: recommendAttraction.attractionAddress, 
            attractionContent: recommendAttraction.attractionContent,
            images: recommendAttraction.images,
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

    const postAttractionImageResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    }

    const deleteAttractionImageResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'NRI' ? '존재하지 않는 이미지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
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

    const handleAttractionImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (!attractionFields[index].isEditable) return;

        const files = Array.from(event.target.files || []);
        
        const updatedAttractionFields = [...attractionFields];
        const newImageFiles = [...imageFiles];
        const newPreviews = [...previews];
        
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage: AttractionImage = {
                    imageId: 0,
                    imageUrl: reader.result as string
                };

                updatedAttractionFields[index] = {
                    ...updatedAttractionFields[index],
                    images: [...updatedAttractionFields[index].images, newImage]
                };
    
                newImageFiles.push(file);
                newPreviews.push(reader.result as string);
    
                setAttractionFields(updatedAttractionFields);
                setImageFiles(newImageFiles);
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleAttractionImageRemove = (index: number, imgIndex: number) => {
        if (!attractionFields[index].isEditable) return;

        const imageId = attractionFields[index].images[imgIndex].imageId;
        const updatedFields = [...attractionFields];
        const updatedImages = updatedFields[index].images.filter((_, i) => i !== imgIndex);

        updatedFields[index].images = updatedImages;

        const newImageFiles = imageFiles.filter((_, i) => i !== imgIndex);
        const newPreviews = previews.filter((_, i) => i !== imgIndex);

        setAttractionFields(updatedFields);
        setImageFiles(newImageFiles);
        setPreviews(newPreviews);

        deleteAttractionImageRequest(recommendAttraction.attractionId, imageId, accessToken).then(deleteAttractionImageResponse);
    };

    const onImageClickHandler = (index: number) => {
        if (!attractionFields[index].isEditable) return;
        const inputRef = imageInputRef.current[index];
        if (inputRef) {
            inputRef.click();
        }
    };

    const onDeleteButtonClickHandler = (attractionId: number) => {
        if (!accessToken || !recommendId) return;

        const confirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirm) return;

        deleteRecommendAttractionRequest(recommendId, attractionId, accessToken).then(deleteRecommendAttractionResponse);
        setAttractionFields((prevFields) => prevFields.filter((field) => field.attractionId !== attractionId));
    }

    const onUpdateButtonClickHandler = async (index: number) => {
        if (!accessToken || !recommendId) return;
    
        const { attractionName, attractionAddress, attractionContent, images } = attractionFields[index];
    
        if (!attractionAddress || !attractionName || !attractionContent || !images) {
            alert('내용을 입력해주세요.');
            return;
        }
    
        const uploadedImages: string[] = [];
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            const uploadedImage = await fileUploadRequest(formData, accessToken);
            if (uploadedImage) uploadedImages.push(uploadedImage); // 서버에서 반환된 이미지 URL을 배열에 추가
        }
    
        const existingImageUrls = images.map((image) => image.imageUrl); // 기존 이미지 URL 추출
    
        const allImageUrls = [...existingImageUrls, ...uploadedImages]; // 기존 이미지와 업로드된 이미지 URL을 합침
    
        const requestBody: PatchRecommendAttractionRequestDto = {
            attractionName,
            attractionAddress,
            attractionContent,
            images: allImageUrls 
        }
    

        patchRecommendAttractionRequest(requestBody, recommendId, recommendAttraction.attractionId, accessToken)
            .then((responseBody) => patchRecommendAttractionResponse(responseBody, index));

        for (const uploadedImageUrl of uploadedImages) {
            const requestBodyForImage: PostAttractionImageRequestDto = {
                imageUrl: uploadedImageUrl
            };
            
            postAttractionImageRequest(requestBodyForImage, recommendAttraction.attractionId, accessToken)
                .then(postAttractionImageResponse);
        }
    };
    

    return (
        <div>
            {attractionFields.map((field, index) => (
                <div key={index} className="attraction-field box-container">
                    <div
                        className="remove-field-btn"
                        onClick={() => onDeleteButtonClickHandler(field.attractionId)}
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
                        
                        <div className="image-uploader">
                            <input
                                type="file"
                                multiple
                                ref={(el) => (imageInputRef.current[index] = el)}
                                style={{ display: 'none' }}
                                onChange={(e) => handleAttractionImageUpload(index, e)}
                            />
                            <div onClick={() => onImageClickHandler(index)} className="upload-button">이미지 업로드</div>
                            <div className="image-previews">
                                {field.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="preview">
                                        <img src={image.imageUrl} alt={`preview-${imgIndex}`} />
                                        <div className="remove-image-btn" onClick={() => handleAttractionImageRemove(index, imgIndex)}>×</div>
                                    </div>
                                ))}
                            </div>
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
            foodId: recommendFood.foodId,
            foodName: recommendFood.foodName,
            foodContent: recommendFood.foodContent,
            isEditable: false
        },
    ]);

    const deleteRecommendFoodResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 음식입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    };

    const patchRecommendFoodResponse = (responseBody: ResponseDto | null, index: number) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 음식입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        toggleEditState(index);
    };

    const handleFoodChange = (index: number, field: 'foodName' | 'foodContent', value: string) => {
        const updatedFields = [...foodFields];
        updatedFields[index][field] = value;
        setFoodFields(updatedFields);
    };

    const toggleEditState = (index: number) => {
        setFoodFields((prevFields) =>
            prevFields.map((field, i) =>
                i === index ? { ...field, isEditable: !field.isEditable } : field
            )
        );
    };

    const onDeleteButtonClickHandler = (foodId: number) => {
        if (!accessToken || !recommendId) return;

        const confirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirm) return;

        deleteRecommendFoodRequest(recommendId, foodId, accessToken).then(deleteRecommendFoodResponse);
        setFoodFields((prevFields) => prevFields.filter((field) => field.foodId !== foodId));
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

        patchRecommendFoodRequest(requestBody, recommendId, recommendFood.foodId, accessToken).then((responseBody) =>
            patchRecommendFoodResponse(responseBody, index)
        );
    };

    return (
        <div>
            {foodFields.map((field, index) => (
                <div key={index} className="food-field box-container">
                    <div className="remove-field-btn" onClick={() => onDeleteButtonClickHandler(field.foodId)}>
                        ×
                    </div>
                    <div className="box">
                        <div className="field-content">
                            <input
                                type="text"
                                placeholder="음식 이름"
                                value={field.foodName}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleFoodChange(index, 'foodName', e.target.value)}
                            />
                            <textarea
                                placeholder="음식 설명"
                                value={field.foodContent}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleFoodChange(index, 'foodContent', e.target.value)}
                            />
                        </div>
                        <div
                            className="update-field-btn"
                            onClick={() => (field.isEditable ? onUpdateButtonClickHandler(index) : toggleEditState(index))}
                        >
                            {field.isEditable ? '저장' : '✏️'}
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
            missionId: recommendMission.missionId,
            missionName: recommendMission.missionName,
            missionContent: recommendMission.missionContent,
            isEditable: false,
        },
    ]);

    const deleteRecommendMissionResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 미션입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
    };

    const patchRecommendMissionResponse = (responseBody: ResponseDto | null, index: number) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'VF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NAP' ? '존재하지 않는 게시물입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 미션입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        toggleEditState(index);
    };

    const handleMissionChange = (index: number, field: 'missionName' | 'missionContent', value: string) => {
        const updatedFields = [...missionFields];
        updatedFields[index][field] = value;
        setMissionFields(updatedFields);
    };

    const toggleEditState = (index: number) => {
        setMissionFields((prevFields) =>
            prevFields.map((field, i) =>
                i === index ? { ...field, isEditable: !field.isEditable } : field
            )
        );
    };

    const onDeleteButtonClickHandler = (missionId: number) => {
        if (!accessToken || !recommendId) return;

        const confirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirm) return;

        deleteRecommendMissionRequest(recommendId, missionId, accessToken).then(deleteRecommendMissionResponse);
        setMissionFields((prevFields) => prevFields.filter((field) => field.missionId !== missionId));
    };

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

        patchRecommendMissionRequest(requestBody, recommendId, recommendMission.missionId, accessToken).then((responseBody) =>
            patchRecommendMissionResponse(responseBody, index)
        );
    };

    return (
        <div>
            {missionFields.map((field, index) => (
                <div key={index} className="mission-field box-container">
                    <div className="remove-field-btn" onClick={() => onDeleteButtonClickHandler(field.missionId)}>
                        ×
                    </div>
                    <div className="box">
                        <div className="field-content">
                            <input
                                type="text"
                                placeholder="미션 이름"
                                value={field.missionName}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleMissionChange(index, 'missionName', e.target.value)}
                            />
                            <textarea
                                placeholder="미션 설명"
                                value={field.missionContent}
                                readOnly={!field.isEditable}
                                onChange={(e) => handleMissionChange(index, 'missionContent', e.target.value)}
                            />
                        </div>
                        <div
                            className="update-field-btn"
                            onClick={() => (field.isEditable ? onUpdateButtonClickHandler(index) : toggleEditState(index))}
                        >
                            {field.isEditable ? '저장' : '✏️'}
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

    const [foodFields, setFoodFields] = useState<FoodField[]>([{ foodName: '', foodContent: '', images: [] }]);
    const [missionFields, setMissionFields] = useState<MissionField[]>([{ missionName: '', missionContent: '', images: [] }]);
    const [attractionFields, setAttractionFields] = useState<AttractionField[]>([{ attractionName: '', attractionAddress: '', attractionContent: '', images: [] }]);
    
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const imageInputRef = useRef<(HTMLInputElement | null)[]>([]);

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

    // function: 추천 게시글 가져오기 요청 함수 //
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

    const handleMissionChange = (index: number, field: 'missionName' | 'missionContent', value: string) => {
        const updatedFields = [...missionFields];
        updatedFields[index][field] = value;
        setMissionFields(updatedFields);
    };

    const handleAddMissionField = () => {
        setMissionFields([...missionFields, { missionName: '', missionContent: '', images:[] }]);
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
        setFoodFields([...foodFields, { foodName: '', foodContent: '', images:[] }]);
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
        setAttractionFields([...attractionFields, { attractionName: '', attractionAddress: '', attractionContent: '', images: [] }]);
    };

    const handleRemoveAttractionField = (index: number) => {
        const updatedFields = attractionFields.filter((_, i) => i !== index);
        setAttractionFields(updatedFields);
    };

    const handleFoodImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        const updatedFoodFields = [...foodFields];
        const newImageFiles = [...imageFiles];
        const newPreviews = [...previews];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatedFoodFields[index] = {
                    ...updatedFoodFields[index], 
                    images: [...updatedFoodFields[index].images, reader.result as string]
                };
    
                newImageFiles.push(file);
                newPreviews.push(reader.result as string);
    
                setFoodFields(updatedFoodFields);
                setImageFiles(newImageFiles);
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleFoodImageRemove = (index: number, imgIndex: number) => {
        const updatedFields = [...foodFields];
        const updatedImages = updatedFields[index].images.filter((_, i) => i !== imgIndex);
    
        updatedFields[index].images = updatedImages; 
    
        const newImageFiles = imageFiles.filter((_, i) => i !== imgIndex);
        const newPreviews = previews.filter((_, i) => i !== imgIndex);
    
        setFoodFields(updatedFields); 
        setImageFiles(newImageFiles); 
        setPreviews(newPreviews); 
    };

    const handleMissionImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        const updatedMissionFields = [...missionFields];
        const newImageFiles = [...imageFiles];
        const newPreviews = [...previews];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatedMissionFields[index] = {
                    ...updatedMissionFields[index], 
                    images: [...updatedMissionFields[index].images, reader.result as string]
                };
    
                newImageFiles.push(file);
                newPreviews.push(reader.result as string);
    
                setMissionFields(updatedMissionFields);
                setImageFiles(newImageFiles);
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleMissionImageRemove = (index: number, imgIndex: number) => {
        const updatedFields = [...missionFields];
        const updatedImages = updatedFields[index].images.filter((_, i) => i !== imgIndex);
    
        updatedFields[index].images = updatedImages; 
    
        const newImageFiles = imageFiles.filter((_, i) => i !== imgIndex);
        const newPreviews = previews.filter((_, i) => i !== imgIndex);
    
        setMissionFields(updatedFields); 
        setImageFiles(newImageFiles); 
        setPreviews(newPreviews); 
    };

    const handleAttractionImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        
        const updatedAttractionFields = [...attractionFields];
        const newImageFiles = [...imageFiles];
        const newPreviews = [...previews];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatedAttractionFields[index] = {
                    ...updatedAttractionFields[index], 
                    images: [...updatedAttractionFields[index].images, reader.result as string]
                };
    
                newImageFiles.push(file);
                newPreviews.push(reader.result as string);
    
                setAttractionFields(updatedAttractionFields);
                setImageFiles(newImageFiles);
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleAttractionImageRemove = (index: number, imgIndex: number) => {
        const updatedFields = [...attractionFields];
        const updatedImages = updatedFields[index].images.filter((_, i) => i !== imgIndex);
    
        updatedFields[index].images = updatedImages; 
    
        const newImageFiles = imageFiles.filter((_, i) => i !== imgIndex);
        const newPreviews = previews.filter((_, i) => i !== imgIndex);
    
        setAttractionFields(updatedFields); 
        setImageFiles(newImageFiles); 
        setPreviews(newPreviews); 
    };

    const onImageClickHandler = (index: number) => {
        const inputRef = imageInputRef.current[index];
        if (inputRef) {
            inputRef.click();
        }
    };

    //  event handler: 추천 게시글 수정 버튼 클릭 핸들러 //
    const onPatchButtonClickHandler = async () => {
        if (!accessToken || !recommendId) return;
    
        const uploadedImages: string[] = [];
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            const uploadedImage = await fileUploadRequest(formData, accessToken);
            if (uploadedImage) uploadedImages.push(uploadedImage);
        }

        const requestBody: PatchRecommendPostRequestDto = {
            foods: category === 'food' 
                ? foodFields.map((field) => ({...field, images: uploadedImages})) : null,
            missions: category === 'mission' 
                ? missionFields.map((field) => ({...field, images: uploadedImages})) : null,
            attractions: category === 'attraction'
                ? attractionFields.map((field) => ({...field, images: uploadedImages})) : null
        };

        patchRecommendPostRequest(requestBody, recommendId, category, accessToken).then(patchRecommendPostResponse);
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
                                <div className="image-uploader">
                                    <input
                                        type="file"
                                        multiple
                                        ref={(el) => (imageInputRef.current[index] = el)}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleAttractionImageUpload(index, e)}
                                    />
                                    <div onClick={() => onImageClickHandler(index)} className="upload-button">이미지 업로드</div>
                                    <div className="image-previews">
                                        {field.images.map((preview, imgIndex) => (
                                            <div key={imgIndex} className="preview">
                                                <img src={preview} alt={`preview-${imgIndex}`} />
                                                <div className="remove-image-btn" onClick={() => handleAttractionImageRemove(index, imgIndex)}>×</div>
                                            </div>
                                        ))}
                                    </div>
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
                                <div className="image-uploader">
                                    <input
                                        type="file"
                                        multiple
                                        ref={(el) => (imageInputRef.current[index] = el)}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFoodImageUpload(index, e)}
                                    />
                                    <div onClick={() => onImageClickHandler(index)} className="upload-button">이미지 업로드</div>
                                    <div className="image-previews">
                                        {field.images.map((preview, imgIndex) => (
                                            <div key={imgIndex} className="preview">
                                                <img src={preview} alt={`preview-${imgIndex}`} />
                                                <div className="remove-image-btn" onClick={() => handleFoodImageRemove(index, imgIndex)}>×</div>
                                            </div>
                                        ))}
                                    </div>
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
                                <div className="image-uploader">
                                    <input
                                        type="file"
                                        multiple
                                        ref={(el) => (imageInputRef.current[index] = el)}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleMissionImageUpload(index, e)}
                                    />
                                    <div onClick={() => onImageClickHandler(index)} className="upload-button">이미지 업로드</div>
                                    <div className="image-previews">
                                        {field.images.map((preview, imgIndex) => (
                                            <div key={imgIndex} className="preview">
                                                <img src={preview} alt={`preview-${imgIndex}`} />
                                                <div className="remove-image-btn" onClick={() => handleMissionImageRemove(index, imgIndex)}>×</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mission-field add-button" onClick={handleAddMissionField}>+</div>
                </div>
            )}

            <button className="submit-button" onClick={onPatchButtonClickHandler}>게시물 수정</button>
        </div>
    );

}