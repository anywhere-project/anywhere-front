import React, { useState } from 'react';
import './style.css';

function MyPageUpdate() {
    const [telNumber, setTelNumber] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');

    // // 이미지 파일을 선택했을 때 실행되는 함수
    // const handleImageChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setProfileImage(reader.result); // 이미지를 base64로 읽어서 상태에 저장
    //         };
    //         reader.readAsDataURL(file); // 파일을 base64로 읽기
    //     }
    // };

    // 폼 제출 함수
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // 실제 API 호출을 통해 업데이트 처리할 수 있음
        console.log({
            telNumber,
            name,
            nickname,
            profileImage,
        });
        alert('프로필이 업데이트되었습니다!');
    };

    return (
        <div id='mypage-update'>
        <div id="mypage-update">
            <h2>프로필 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="telNumber">전화번호</label>
                    <input 
                        type="text" 
                        id="telNumber" 
                        value={telNumber} 
                        onChange={(e) => setTelNumber(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input 
                        type="text" 
                        id="nickname" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profileImage">프로필 이미지</label>
                    <div 
                        className="profile-image" 
                        style={{ backgroundImage: `url(${profileImage})` }}
                    >
                        <input 
                            id="fileInput" 
                            type="file" 
                            style={{ display: 'none' }} 
                            
                            accept="image/*" 
                        />
                        {/* <button type="button" onClick={() => document.getElementById('fileInput').click()}>
                            이미지 변경
                        </button> */}
                    </div>
                </div>
                <button type="submit">프로필 업데이트</button>
            </form>
        </div>
        </div>
    );
}

export default MyPageUpdate;
