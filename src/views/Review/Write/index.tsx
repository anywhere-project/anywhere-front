import { ResponseDto } from 'apis/dto/response';
import { ACCESS_TOKEN, REVIEW_PATH } from '../../../constants';
import React, { ChangeEvent, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSignInUserStore } from 'stores';
import './style.css';
import { RiImageAddFill } from 'react-icons/ri';
import { fileUploadRequest, postReviewRequest } from 'apis';
import { PostReviewRequestDto } from 'apis/dto/request/review';

// component: 후기 작성 화면 컴포넌트
export default function ReviewWrite() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 후기 정보 상태 //
    const [reviewContent, setReviewContent] = useState<string>('');

    // state: 이미지 입력 참조 //
    const [previews, setPreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // state: 해시태그 입력 //
    const [inputHashTag, setInputHashTag] = useState('');
    const [hashTags, setHashTags] = useState<string[]>([]);

    // function: navigator 함수 //
    const navigator = useNavigate();

    // function: empty value 함수 //
    const isEmptyValue = (value: string): boolean => {
        return value === null || value === undefined || value.trim() === '';
    };

    // function: post review response 처리 함수 //
    const postReviewResponse = (responseBody: ResponseDto | null) => {
        const message =
        !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '모두 입력해주세요.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                responseBody.code === 'NI' ? '해당 사용자가 없습니다.' :
                    responseBody.code === 'NP' ? '해당 권한이 없습니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
        alert(message);
        return;
        }

        navigator(REVIEW_PATH);
    }
    
    // event handler: 내용 변경 이벤트 처리 함수 //
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setReviewContent(value);
    };

    // event handler: 후기 작성 이벤트 처리 //
    const postReviewPostButtonClickHandler = async () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
    
        const uploadedImages: string[] = await Promise.all(imageFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const uploadedImage = await fileUploadRequest(formData, accessToken);
                return uploadedImage || '';
            })
        );
    
        const requestBody: PostReviewRequestDto = {
            reviewContent: reviewContent,
            images: uploadedImages,
            hashtags: hashTags
        };

        postReviewRequest(requestBody, accessToken).then(postReviewResponse);
    }; 
    

    // event handler: 이미지 클릭 이벤트 처리 //
    const onHandleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); 
        }
    };

    // event handler: 이미지 업로드 이벤트 처리 //
    const onHandleImageUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;
        
        const newPreviews: string[] = [];
    
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        setImageFiles((prev) => [...prev, ...files]);
    };

    // event handler: 이미지 삭제 이벤트 처리 함수 //
    const onHandleImageRemoveHandler = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // event handler: 해시태그 입력 이벤트 처리 //
    const addHashTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedCommand = ['Enter', 'Space', 'Comma', 'NumpadEnter'];
        if (!allowedCommand.includes(e.key)) return;
    
        const target = e.target as HTMLInputElement;
    
        if (isEmptyValue(target.value.trim())) {
            return setInputHashTag('');
        }
    
        let newHashTag = target.value.trim();
        if (!newHashTag.startsWith('#')) {
            newHashTag = `#${newHashTag}`;
        }
        const regExp = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\$%&\\\=\(\'\"]/g;
        if (regExp.test(newHashTag)) {
            newHashTag = newHashTag.replace(regExp, '');
        }
        if (newHashTag.includes(',')) {
            newHashTag = newHashTag.split(',').join('');
        }
    
        if (isEmptyValue(newHashTag)) return;
    
        setHashTags((prevHashTags) => {
            return [...prevHashTags, newHashTag].filter((value, index, self) => self.indexOf(value) === index);
        });
    
        setInputHashTag('');
    };

    // event handler: 키 다운 이벤트 처리 //
    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
        e.preventDefault();

        const target = e.target as HTMLInputElement;
        
        const regExp = /^[a-z|A-Z|가-힣|ㄱ-ㅎ|ㅏ-ㅣ|0-9| \t|]+$/g;
        if (!regExp.test(target.value)) {
            setInputHashTag('');
        }
    };
     
    // event handler: 해시태그 변경 이벤트 처리 함수 //
    const changeHashTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setInputHashTag(target.value);
    };

    // event handler: 해시태그 변경 이벤트 처리 함수 //
    const handleDeleteHashTag = (hashTagToDelete: string) => {
        setHashTags((prevHashTags) =>
            prevHashTags.filter((hashTag) => hashTag !== hashTagToDelete)
        );
    };

    // render : 후기 작성 컴포넌트 렌더링 //
    return (
        <div className='review-write'>
            <div className='review-write-container'>
                <div className='review-write-top'>
                    <h1>후기 작성</h1>
                    <div>이번 여행은 어떠셨나요? 당신의 여행을 모두에게 알려주세요!</div>
                </div>
                <div className='review-write-middle'>
                    <div className='field-content'>
                        <div className="field-label">사진 첨부</div>
                        <div className="image-uploader">
                            {previews.map((preview, index) => (
                                <div key={index} style={{ display: "inline-block", margin: "10px" }}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                    <div className='delete-button' onClick={() => onHandleImageRemoveHandler(index)}>
                                        삭제
                                    </div>
                                </div>
                            ))}
                            <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple accept="image/*" onChange={onHandleImageUploadHandler} />
                            <div className="upload-button" onClick={onHandleButtonClick}><RiImageAddFill /></div>
                        </div>
                    </div>
                    <div className='field-content'>
                        <div className="field-label">내용 작성</div>
                        <textarea className="review-content" placeholder="여행에 대한 설명을 입력해주세요." onChange={onContentChangeHandler} />
                    </div>
                    <div className='field-content'>
                        <div className="field-label">해시태그 선택</div>
                        <div className='hash-field'>
                            {hashTags.length > 0 &&
                                hashTags.map((hashTag) => {
                                return (
                                    <div key={hashTag} className='tag' onClick={() => handleDeleteHashTag(hashTag)}>
                                        {hashTag}
                                    </div>
                                );
                            })}
                        </div>
                        <input
                        value={inputHashTag}
                        onChange={changeHashTagInput}
                        onKeyUp={addHashTag}
                        onKeyDown={keyDownHandler}

                        placeholder='#해시태그를 등록해보세요. (최대 10개)'
                        className='hashTagInput'
                        />
                        <div className='delete-info'>생성하신 해시태그를 누르시면 삭제가 됩니다.</div>
                    </div>
                </div>
                <div className='review-write-bottom'>
                    <div className="add-button" onClick={postReviewPostButtonClickHandler}>등록</div>
                </div>
            </div>
        </div>
    )
}
