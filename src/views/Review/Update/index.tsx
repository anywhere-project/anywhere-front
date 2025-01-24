import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import GetReviewResponseDto from 'apis/dto/response/review/get-review.response.dto';
import { ResponseDto } from 'apis/dto/response';
import { RiImageAddFill } from 'react-icons/ri';
import { deleteReviewPostRequest, fileUploadRequest, getReviewPostRequest, patchReviewPostRequest } from 'apis';
import { ACCESS_TOKEN, REVIEW_PATH } from '../../../constants';
import PatchReviewPostRequestDto from 'apis/dto/request/review/patch-review-post.request.dto';

// component: 후기 수정 화면 컴포넌트
export default function ReviewUpdate() {

  // state: 게시글 번호 경로 변수 상태 //
  const { reviewId } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();
  const accessToken = cookies[ACCESS_TOKEN];

  // state: 후기 게시글 상태 //
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 서버 이미지
  const [newImages, setNewImages] = useState<File[]>([]); // 새로 업로드한 이미지
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [inputHashTag, setInputHashTag] = useState('');
  const [hashTags, setHashTags] = useState<string[]>([]);

  // function: navigator 함수 //
  const navigator = useNavigate();

  // function: empty value 함수 //
  const isEmptyValue = (value: string): boolean => {
    return value === null || value === undefined || value.trim() === '';
  };

  // function: 후기 게시글 가져오기 요청 함수 //
  const getReviewPostResponse = (responseBody: GetReviewResponseDto | ResponseDto | null) => {
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

      const { reviewContent, hashTags, images } = responseBody as GetReviewResponseDto;
      setReviewContent(reviewContent);
      setHashTags(hashTags);
      setExistingImages(images.map((image) => image.imageUrl));
      setPreviews(images.map((image) => image.imageUrl));
      
  }

  // function: 후기 게시글 수정 요청 함수 //
    const patchReviewPostResponse = (responseBody: ResponseDto | null) => {
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
        navigator(REVIEW_PATH);
    };

  // function: 후기 게시글 삭제하기 요청 함수 //
  const deleteReviewPostResponse = (responseBody: ResponseDto | null) => {
    const message = 
        !responseBody ? '서버에 문제가 있습니다.' :
        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
        responseBody.code === 'NRV' ? '존재하지 않는 후기입니다.' :
        responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
        responseBody.code === 'NP' ? '권한이 없습니다.' :
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
                setPreviews((prev) => [...prev, reader.result as string]); // 미리보기 상태
            };
            reader.readAsDataURL(file);
        });

        setNewImages((prev) => [...prev, ...files]); // 새로 업로드한 이미지 상태
    };

  // event handler: 이미지 삭제 이벤트 처리 함수 //
  const onHandleImageRemoveHandler = (index: number) => {
        // 기존 이미지인지 새 이미지인지 확인
        if (index < existingImages.length) {
            // 기존 이미지 삭제
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            // 새 이미지 삭제
            const newIndex = index - existingImages.length;
            setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
        }

        // 미리보기에서도 삭제
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

  // event handler: 후기 수정 작성 이벤트 처리 //
  const updateReviewPostButtonClickHandler = async () => {
    if (!accessToken || !reviewId) return;

    // 새 이미지만 업로드
    const uploadedNewImages: string[] = await Promise.all(newImages.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const uploadedImage = await fileUploadRequest(formData, accessToken);
            return uploadedImage || '';
        })
    );

    // 기존 이미지와 새 이미지 URL 병합
    const uploadedImages = [...existingImages, ...uploadedNewImages];

    const requestBody: PatchReviewPostRequestDto = {
        reviewContent: reviewContent,
        images: uploadedImages,
        hashtags: hashTags
    };

    patchReviewPostRequest(requestBody, reviewId, accessToken).then(patchReviewPostResponse);
  }; 

  // event handler: 후기 삭제 작성 이벤트 처리 //
  const deleteReviewPostButtonClickHandler = async () => {
    if (!accessToken || !reviewId) return;
    
    const confirm = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirm) return;

    deleteReviewPostRequest(reviewId, accessToken).then(deleteReviewPostResponse);
  };

  // effect: 컴포넌트 로드 시 후기 정보 불러오기 함수 //
  useEffect(() => {
    window.scrollTo(0, 0);
      if (!reviewId) return;
      getReviewPostRequest(reviewId).then(getReviewPostResponse);
  }, []);

  return (
    <div className='review-update'>
      <div className='review-update-container'>
        <div className='review-update-top'>
            <h1>후기 수정</h1>
            <div>이번 여행은 어떠셨나요? 당신의 여행을 모두에게 알려주세요!</div>
        </div>
        <div className='review-update-middle'>
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
              <textarea className="review-content" value={reviewContent} onChange={onContentChangeHandler} />
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
        <div className='review-bottom-group'>
            <div className="update-button" onClick={updateReviewPostButtonClickHandler}>수정</div>
            <div className="delete-button" onClick={deleteReviewPostButtonClickHandler}>삭제</div>
        </div>
      </div>
    </div>
  )
}
