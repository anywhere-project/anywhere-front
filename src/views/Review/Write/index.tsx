import { ResponseDto } from 'apis/dto/response';
import { REVIEW_PATH } from '../../../constants';
import React, { ChangeEvent, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSignInUserStore } from 'stores';

// component: 후기 작성 화면 컴포넌트
export default function ReviewWrite() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: 후기 정보 상태 //
    const [ImageFile, setImageFile] = useState<File | null>(null);
    const [Image, setImage] = useState<string>('');

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // function: navigator 함수 //
    const navigator = useNavigate();

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

    // event handler: 이미지 클릭 이벤트 처리 //
    const onImageClickHandler = () => {
        const { current } = imageInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 이미지 변경 이벤트 처리 함수 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setImageFile(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
        setImage(fileReader.result as string);
        };
    };

    // render : 후기 작성 컴포넌트 렌더링 //
    return (
        <div id='review-write'>
            <h1>후기 작성</h1>
            <input
                type="file"
                ref={imageInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={onImageInputChangeHandler}
            />
        </div>
    )
}
