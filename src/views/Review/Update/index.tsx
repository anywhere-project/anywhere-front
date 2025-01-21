import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import GetReviewResponseDto from 'apis/dto/response/review/get-review.response.dto';
import { ResponseDto } from 'apis/dto/response';
import { RiImageAddFill } from 'react-icons/ri';
import { getReviewPostRequest } from 'apis';

// component: 후기 수정 화면 컴포넌트
export default function ReviewUpdate() {

  // state: 게시글 번호 경로 변수 상태 //
  const { reviewId } = useParams();

  // state: cookie 상태 //
  const [cookies] = useCookies();

  // state: 후기 게시글 상태 //
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [inputHashTag, setInputHashTag] = useState('');
  const [hashTags, setHashTags] = useState<string[]>([]);

  // function: empty value 함수 //
  const isEmptyValue = (value: string): boolean => {
    return value === null || value === undefined || value.trim() === '';
  };

  // function: 추천 게시글 가져오기 요청 함수 //
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

      const { reviewContent, hashTags, imageUrl } = responseBody as GetReviewResponseDto;
      setReviewContent(reviewContent);
      setHashTags(hashTags);
      // setPreviews(imageUrl.map((image) => image.imageUrl));
      
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

  // effect: 컴포넌트 로드 시 후기 정보 불러오기 함수 //
  useEffect(() => {
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
                          <div key={hashTag} className='tag'>
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
          </div>
        </div>
      </div>
    </div>
  )
}
