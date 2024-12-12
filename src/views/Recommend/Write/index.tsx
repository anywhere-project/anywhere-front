import { useNavigate } from 'react-router-dom';
import './style.css';
import { useCookies } from 'react-cookie';
import { useState, ChangeEvent, useRef } from 'react';
import { ACCESS_TOKEN, RECOMMEND_PATH } from '../../../constants';
import { ResponseDto } from 'apis/dto/response';
import { PostRecommendPostRequestDto } from 'apis/dto/request/recommend';
import { fileUploadRequest, postRecommendPostRequest } from 'apis';

export default function RecommendWrite() {

    // cookie: 쿠키 상태 //
    const [cookies] = useCookies();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // 추천 게시글 상태 //
    const [attractionName, setAttractionName] = useState<string>('');
    const [attractionAddress, setAttractionAddress] = useState<string>('');
    const [attractionContent, setAttractionContent] = useState<string>('');
    const [foodName, setFoodName] = useState<string>('');
    const [foodContent, setFoodContent] = useState<string>('');
    const [missionName, setMissionName] = useState<string>('');
    const [missionContent, setMissionContent] = useState<string>('');
    const [imageOrder, setImageOrder] = useState<number>(0);
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // 현재 선택된 카테고리 //
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [startIndex, setStartIndex] = useState<number>(0);

    // functoin: 추천 게시글 작성 요청 함수 //
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

    // evnent handler: 추천 게시글 작성 버튼 클릭 핸들러 //
    const onPostButtonClickHandler = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const formData = new FormData();
        imageFiles.forEach((file) => {
            formData.append("file", file);
        });

        const attraction = attractionName || attractionAddress || attractionContent
            ? { attractionName, attractionAddress, attractionContent }
            : null;

        const food = foodName || foodContent
            ? { foodName, foodContent }
            : null;

        const mission = missionName || missionContent
            ? { missionName, missionContent }
            : null;

        const images = imageFiles.map((file, index) => ({
            imageOrder: index,
            imageUrl: URL.createObjectURL(file),
        }));

        const requestBody: PostRecommendPostRequestDto = {
            attraction, food, mission, images
        };

        await fileUploadRequest(formData, accessToken);
        postRecommendPostRequest(requestBody, accessToken).then(postRecommendPostResponse);
    };

    const onCategorySelectHandler = (category: string) => {
        setSelectedCategory(category);
    };

    const onAttractionNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAttractionName(value);
    };

    const onAttractionAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAttractionAddress(value);
    };

    const onAttractionContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setAttractionContent(value);
    };

    const onFoodNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFoodName(value);
    };

    const onFoodContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFoodContent(value);
    };

    const onMissionNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMissionName(value);
    };

    const onMissionContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setMissionContent(value);
    };

    // event handler: 이미지 클릭 이벤트 처리 //
    const onImageClickHandler = () => {
        const { current } = imageInputRef;
        if (!current) return;
        current.click();
    }

    const onImageInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const selectedFiles = [...imageFiles];
        const selectedPreviews: string[] = [];

        files.forEach((file) => {
            selectedFiles.push(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                selectedPreviews.push(reader.result as string); // 읽은 결과를 미리보기 배열에 추가
                if (selectedPreviews.length === files.length) {
                    setImageFiles(selectedFiles); // 모든 파일을 상태에 저장
                    setPreviews(selectedPreviews); // 미리보기 이미지 상태에 저장
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const goToNextImages = () => {
        setStartIndex((prevIndex) => Math.min(prevIndex + 3, previews.length - 1));
    };

    const goToPreviousImages = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 3, 0));
    };

    return (
        <div className="recommend-write">
            <h1>추천 게시글 작성</h1>

            <div className="category-buttons">
                <button onClick={() => onCategorySelectHandler('attraction')}>관광지 추천</button>
                <button onClick={() => onCategorySelectHandler('food')}>먹거리 추천</button>
                <button onClick={() => onCategorySelectHandler('mission')}>미션 추천</button>
            </div>

            {selectedCategory === 'attraction' && (
                <div className="input-section">
                    <h2>관광지</h2>
                    <input
                        type="text"
                        placeholder="관광지 이름"
                        value={attractionName}
                        onChange={onAttractionNameChangeHandler}
                    />
                    <input
                        type="text"
                        placeholder="관광지 주소"
                        value={attractionAddress}
                        onChange={onAttractionAddressChangeHandler}
                    />
                    <textarea
                        placeholder="관광지 내용"
                        value={attractionContent}
                        onChange={onAttractionContentChangeHandler}
                    />
                </div>
            )}

            {selectedCategory === 'food' && (
                <div className="input-section">
                    <h2>먹거리</h2>
                    <input
                        type="text"
                        placeholder="음식 이름"
                        value={foodName}
                        onChange={onFoodNameChangeHandler}
                    />
                    <textarea
                        placeholder="음식 내용"
                        value={foodContent}
                        onChange={onFoodContentChangeHandler}
                    />
                </div>
            )}

            {selectedCategory === 'mission' && (
                <div className="input-section">
                    <h2>미션</h2>
                    <input
                        type="text"
                        placeholder="미션 이름"
                        value={missionName}
                        onChange={onMissionNameChangeHandler}
                    />
                    <textarea
                        placeholder="미션 내용"
                        value={missionContent}
                        onChange={onMissionContentChangeHandler}
                    />
                </div>
            )}

            <input
                type="file"
                ref={imageInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={onImageInputChangeHandler}
            />
            <button onClick={onImageClickHandler}>이미지 선택</button>
            <div>
                {imageFiles.map((file, index) => (
                    <div key={index}>
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>

            <div className="image-preview">
                {previews.length > 0 && (
                    <div className="image-slider">
                        <button
                            className="slider-button prev-button"
                            onClick={goToPreviousImages}
                            disabled={startIndex === 0}
                        >
                            이전
                        </button>

                        <div className="images">
                            {previews.slice(startIndex, startIndex + 3).map((src, index) => (
                                <div key={index} className="image-item">
                                    <img src={src} alt={`preview-${startIndex + index}`} className="preview-image" />
                                </div>
                            ))}
                        </div>

                        <button
                            className="slider-button next-button"
                            onClick={goToNextImages}
                            disabled={startIndex + 3 >= previews.length}
                        >
                            다음
                        </button>
                    </div>
                )}
                {previews.length === 0 && <p>이미지를 선택해주세요.</p>}
            </div>

            <button className="submit-button" type="button" onClick={onPostButtonClickHandler}>
                작성
            </button>
        </div>
    );
}