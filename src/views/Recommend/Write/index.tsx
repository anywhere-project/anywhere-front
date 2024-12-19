import { useState, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, RECOMMEND_PATH } from '../../../constants';
import { fileUploadRequest, postRecommendPostRequest } from 'apis';
import { PostRecommendPostRequestDto } from 'apis/dto/request/recommend';
import { PostRecommendMissionRequestDto } from 'apis/dto/request/recommend';
import { ResponseDto } from 'apis/dto/response';
import './style.css';

export default function RecommendWrite() {
    const [cookies] = useCookies();
    const navigator = useNavigate();

    const [category, setCategory] = useState<string>('attraction');
    const [foodFields, setFoodFields] = useState([{ foodName: '', foodContent: '' }]);
    const [missionFields, setMissionFields] = useState([{ missionName: '', missionContent: '' }]);
    const [attractionFields, setAttractionFields] = useState([{ attractionName: '', attractionAddress: '', attractionContent: '' }]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const handleCategoryChange = (category: string) => {
        setCategory(category);
    };

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

        const uploadedImages = [];
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            const uploadedImage = await fileUploadRequest(formData, accessToken);
            if (uploadedImage) uploadedImages.push(uploadedImage);
        }

        const requestBody: PostRecommendPostRequestDto = {
            recommendCategory: category,
            foods: category === 'food' ? foodFields : null,
            missions: category === 'mission' ? missionFields : null,
            attractions: category === 'attraction' ? attractionFields : null,
            images: uploadedImages.map((url, index) => ({ imageOrder: index, imageUrl: url })),
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
                    <div className='attraction-filed add-button' onClick={handleAddAttractionField}>+</div>
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

            <div className="submit-button" onClick={postRecommendPostButtonClickHandler}>게시글 작성</div>
        </div>
    );
    
}
