import React, { ChangeEvent, useRef, useState } from 'react'

// component: 후기 작성 화면 컴포넌트
export default function ReviewWrite() {

    // state: 후기 정보 상태 //
    const [ImageFile, setImageFile] = useState<File | null>(null);
    const [Image, setImage] = useState<string>('');

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

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
