import { useState, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, RECOMMEND_PATH } from '../../../constants';
import { ResponseDto } from 'apis/dto/response';
import { PostRecommendPostRequestDto } from 'apis/dto/request/recommend';
import { fileUploadRequest, postRecommendPostRequest } from 'apis';
import './style.css';
import { useDaumPostcodePopup } from 'react-daum-postcode';

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

export default function RecommendWrite() {
    const [cookies] = useCookies();
    const navigator = useNavigate();

    const [category, setCategory] = useState<string>('attraction');
    const [foodFields, setFoodFields] = useState<FoodField[]>([{ foodName: '', foodContent: '', images: [] }]);
    const [missionFields, setMissionFields] = useState<MissionField[]>([{ missionName: '', missionContent: '', images: [] }]);
    const [attractionFields, setAttractionFields] = useState<AttractionField[]>([{ attractionName: '', attractionAddress: '', attractionContent: '', images: [] }]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[][]>([]);
    const imageInputRef = useRef<(HTMLInputElement | null)[]>([]);

    const daumPostcodePopup = useDaumPostcodePopup();

    const handleCategoryChange = (category: string) => {
        setCategory(category);
    };

    const handleMissionChange = (index: number, field: 'missionName' | 'missionContent', value: string) => {
        const updatedFields = [...missionFields];
        updatedFields[index][field] = value;
        setMissionFields(updatedFields);
    };

    const handleAddMissionField = () => {
        setMissionFields([...missionFields, { missionName: '', missionContent: '', images: [] }]);
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
        setFoodFields([...foodFields, { foodName: '', foodContent: '', images: [] }]);
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

    const daumPostcodeComplete = (address: any) => {
        const updatedAttractionFields = [...attractionFields];
        const index = updatedAttractionFields.length - 1; 
        handleAttractionChange(index, 'attractionAddress', address.address);
    };

    const onAddressButtonClickHandler = () => {
        daumPostcodePopup({ onComplete: daumPostcodeComplete });
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

                if (!newImageFiles[index]) {
                    newImageFiles[index] = [];
                }
    
                newImageFiles[index].push(file);
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

                if (!newImageFiles[index]) {
                    newImageFiles[index] = [];
                }
    
                newImageFiles[index].push(file);
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
        const newImageFiles: File[][] = [...imageFiles];  
        const newPreviews = [...previews];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatedAttractionFields[index] = {
                    ...updatedAttractionFields[index], 
                    images: [...updatedAttractionFields[index].images, reader.result as string] // base64 이미지
                };

                if (!newImageFiles[index]) {
                    newImageFiles[index] = [];
                }

                newImageFiles[index].push(file);     
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

    const postRecommendPostResponse = (responseBody: ResponseDto | null) => {
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
        
        navigator(RECOMMEND_PATH);
    };

    const postRecommendPostButtonClickHandler = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
    
        const uploadedImages: string[][] = await Promise.all(imageFiles.map(async (fileArray, index) => {
            const uploadedImageUrls: string[] = [];
    
            for (const file of fileArray) {
                const formData = new FormData();
                formData.append('file', file);
                const uploadedImage = await fileUploadRequest(formData, accessToken);
                if (uploadedImage) uploadedImageUrls.push(uploadedImage);
            }
    
            return uploadedImageUrls;
        }));
    
        const requestBody: PostRecommendPostRequestDto = {
            recommendCategory: category,
            foods: category === 'food'
                ? foodFields.map((field, index) => ({ ...field, images: uploadedImages[index] })) : null,
            missions: category === 'mission'
                ? missionFields.map((field, index) => ({ ...field, images: uploadedImages[index] })) : null,
            attractions: category === 'attraction'
                ? attractionFields.map((field, index) => ({ ...field, images: uploadedImages[index] })) : null
        };

        postRecommendPostRequest(requestBody, accessToken).then(postRecommendPostResponse);
    }; 
    

    return (
        <div className="recommend-write">
            <div className="category-selector">
                <div className="category-select">
                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="food">먹거리</option>
                        <option value="attraction">관광지</option>
                        <option value="mission">미션</option>
                    </select>
                </div>
            </div>

            {category === 'mission' && (
                <div>
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
                                        onChange={(e) => handleMissionChange(index, 'missionName', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="미션 내용"
                                        value={field.missionContent}
                                        onChange={(e) => handleMissionChange(index, 'missionContent', e.target.value)}
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
                    <div className='mission-field add-button' onClick={handleAddMissionField}>+</div>
                </div>
            )}

            {category === 'food' && (
                <div>
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

            {category === 'attraction' && (
                <div>
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="관광지 주소"
                                        value={field.attractionAddress}
                                        onChange={(e) => handleAttractionChange(index, 'attractionAddress', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <div 
                                        onClick={onAddressButtonClickHandler} 
                                        style={{
                                            cursor: 'pointer',
                                            color: 'blue',
                                            textDecoration: 'underline',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        우편번호 찾기
                                    </div>
                                </div>
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
                    <div className='attraction-filed add-button' onClick={handleAddAttractionField}>+</div>
                </div>
            )}

            <div className="submit-button" onClick={postRecommendPostButtonClickHandler}>게시글 작성</div>
        </div>
    );
    
}
