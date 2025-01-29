import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import InputBox from '../../../components/InputBox';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { ACCESS_TOKEN, MYPAGE_PATH } from './../../../constants/index';
import { useSignInUserStore } from 'stores';
import { ResponseDto } from 'apis/dto/response';
import { fileUploadRequest, patchPasswordRequest, patchTelAuthCheckRequest, patchTelAuthRequest, patchUserRequest, telAuthRequest } from 'apis';
import PatchPasswordRequestDto from 'apis/dto/request/user/patch-password.request.dto';
import PatchTelAuthRequestDto from 'apis/dto/request/user/patch-tel-auth.request.dto';
import { PatchUserRequestDto } from 'apis/dto/request/user';
import PatchTelAuthCheckRequestDto from 'apis/dto/request/user/patch-tel-auth-check.request.dto';
import { TelAuthRequestDto } from 'apis/dto/request/auth';

const defaultProfileImageUrl = 'https://blog.kakaocdn.net/dn/4CElL/btrQw18lZMc/Q0oOxqQNdL6kZp0iSKLbV1/img.png';

export default function MyPageUpdate() {

    // state: 모달 팝업 상태 //
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 이미지 입력 참조 //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // 프로필 미리보기 URL 상태 //
    const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImageUrl);

    // state: 유저 정보 상태 //
    const { id } = useParams<{ id: string }>();  // URL에서 'id'를 받아옵니다.
    const [userId, setUserId] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [changePassword, setChangePassword] = useState<string>('');
    const [chkPassword, setChkPassword] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [changeTelNumber, setChangeTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [nameMessage, setNameMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [changePasswordMessage, setChangePasswordMessage] = useState<string>('');
    const [chkPasswordMessage, setChkPasswordMessage] = useState<string>('');
    const [changeTelNumberMessage, setChangeTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    const [nameMessageError, setNameMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [changePasswordMessageError, setChangePasswordMessageError] = useState<boolean>(false);
    const [chkPasswordMessageError, setChkPasswordMessageError] = useState<boolean>(false);
    const [changeTelNumberMessageError, setChangeTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    const navigator = useNavigate();


    const patchUserResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'NU' ? '존재하지 않는 사용자입니다.' :
                    responseBody.code === 'VF' ? '잘못된 입력입니다.' :
                        responseBody.code === 'AF' ? '잘못된 접근입니다.' :
                            responseBody.code === 'NP' ? '권한이 없습니다.' :
                                responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                                    responseBody.code === 'SU' ? '수정이 완료되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (isSuccessed) {
            alert(message);
            return;
        }
    }

    const telAuthResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
                responseBody.code === 'DT' ? '중복된 전화번호입니다' :
                    responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
                        responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                            responseBody.code === 'SU' ? '사용 가능한 전화번호입니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setChangeTelNumberMessage(message);
        setChangeTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    }


    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                        responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
    }

    const patchPasswordResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
                responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
                    responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
                        responseBody.code === 'PM' ? '기존 비밀번호가 틀립니다.' :
                            responseBody.code === 'SU' ? '비밀번호가 변경되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setChkPasswordMessage(message);
        setChkPasswordMessageError(!isSuccessed);
        alert(message);
    }

    // event handler: 프로필 이미지 클릭 이벤트 처리 //
    const onProfileImageClickHandler = () => {
        const { current } = imageInputRef;
        if (!current) return;
        current.click();
    };

    // event handler: 이미지 버튼 변환 이벤트 처리 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || !files.length) return;

        const file = files[0];
        setProfileImage(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            setPreviewUrl(fileReader.result as string);
        };
    };

    // event handler: 이름 변경 이벤트 처리 함수 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    }

    // event handler: 닉네임 변경 이벤트 처리 함수 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNickname(value);
    }

    // event handler: 기존 비밀번호 확인 이벤트 처리 함수 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    }

    // event handler: 변경 비밀번호 변경 이벤트 처리 함수 //
    const onChangePasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChangePassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        const message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.';
        setChangePasswordMessage(message);
        setChangePasswordMessageError(!isMatched);
        setMatchedPassword(isMatched);
    }

    // event handler: 변경 비밀번호 확인 이벤트 처리 함수 //
    const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChkPassword(value);
    }

    // event handler: 변경 전화번호 변경 이벤트 처리 함수 //
    const onChangeTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSend(false);
        setChangeTelNumber(value);
        setChangeTelNumberMessage('');
    }

    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setCheckedAuthNumber(false);
        setAuthNumberMessage('');
    }


    // event handler: 비밀번호 수정 버튼 클릭 이벤트 처리 함수 //
    const onUpdatePasswordButtonClickHandler = () => {
        setChangePasswordModalOpen(false);

        if (!password || !changePassword || !chkPassword) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const passwordChkmessage = (signInUser?.password !== password) ? '' : '비밀번호가 틀립니다.';
        setPasswordMessage(passwordChkmessage);
        setPasswordMessageError(!passwordChkmessage)

        const requestBody: PatchPasswordRequestDto = { currentPassword: password, newPassword: changePassword }

        patchPasswordRequest(requestBody, accessToken).then(patchPasswordResponse);
    }

    // const onTelNumberSendClickHandler = () => {
    //     if (!changeTelNumber) return;

    //     const accessToken = cookies[ACCESS_TOKEN];
    //     if (!accessToken) return;

    //     const pattern = /^[0-9]{11}$/;
    //     const isMatched = pattern.test(changeTelNumber);
    //     if (!isMatched) {
    //         setChangeTelNumberMessage('숫자를 11자를 입력해주세요.');
    //         setChangeTelNumberMessageError(true);
    //         return;
    //     }

    //     const requestBody: PatchTelAuthRequestDto = { telNumber: changeTelNumber }

        // telAuthRequest(requestBody).then(patchTelAuthResponse);
    // }

    // event handler: 인증번호 전송 버튼 클릭 핸들러 //
        const onTelNumberSendClickHandler = () => {
            if (!changeTelNumber) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
            if (!telNumber) {
                setChangeTelNumberMessage('숫자 11자를 입력해주세요.');
                return;
            }
    
            const pattern = /^[0-9]{11}$/;
            const isMatched = pattern.test(telNumber);
            if (!isMatched) {
                setChangeTelNumberMessage('숫자 11자를 입력해주세요.');
                setChangeTelNumberMessageError(true);
                return;
            }
    
            const requestBody: TelAuthRequestDto = { telNumber }
    
            telAuthRequest(requestBody).then(telAuthResponse);
        }

    const onUpdateButtonClickHandler = async () => {
        if (!name || !telNumber) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        let url: string | null = previewUrl;
        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            url = await fileUploadRequest(formData, accessToken);
        }

        url = url ? url : previewUrl;

        if (!signInUser) return;

        const requestBody: PatchUserRequestDto = {
            profileImage: url,
            name,
            telNumber,
            nickname,
            userId
        }


        await patchUserRequest(requestBody, accessToken).then(patchUserResponse);
        navigator(MYPAGE_PATH(signInUser?.userId));

    }

    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        const requestBody: PatchTelAuthCheckRequestDto = { telNumber: changeTelNumber, authNumber }

        patchTelAuthCheckRequest(requestBody, accessToken).then(telAuthCheckResponse);
    }

    const onUpdateTelNumberButtonClickHandler = () => {
        setModalOpen(false);
        setTelNumber(changeTelNumber);
    }

    const onChangePasswordButtonClickHandler = () => {
        setChangePasswordModalOpen(true);
    }

    const onChangePasswordModalCancel = () => {
        setChangePasswordModalOpen(false);
    }

    const onTelNumberChangeButtonClickHandler = () => {
        setModalOpen(true);
    }

    const onCancelClickHandler = () => {
        setModalOpen(false);
    }


    const onUpdateCancelButtonClickHandler = () => {

        if (!signInUser) return;
        navigator(MYPAGE_PATH(signInUser?.userId));

    }

    useEffect(() => {
        if (!changePassword || !chkPassword) return;

        const isEqual = changePassword === chkPassword;
        const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
        setChkPasswordMessage(message);
        setChkPasswordMessageError(!isEqual);
        setCheckedPassword(isEqual);
    }, [changePassword, chkPassword]);

    // 유저 정보가 변경되면 state에 반영
    useEffect(() => {
        if (signInUser) {
            setName(signInUser.name || '');
            setNickname(signInUser.nickname || '');
            setTelNumber(signInUser.telNumber || '');
            
            setPreviewUrl(signInUser.profileImage || defaultProfileImageUrl);
        }
    }, [id]);

    const accessToken = cookies[ACCESS_TOKEN];

    // effect : 로그인 필요 //
    useEffect(() => {
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            navigator(-1);
            return;
        }
    }, []);

    if (!accessToken) {
        return null;
    }

    return (
        <div id='mypage-update-wrapper'>
            <div id='mypage-update-container'>
                <div className='input-container'>
                    <div id='profile-image-container'>
                        <div className='profile-image-wrapper' style={{ backgroundImage: `url(${previewUrl})` }}>
                            <input className='profile-image' ref={imageInputRef} style={{ display: 'none' }} type='file' accept='image/*' onChange={onImageInputChangeHandler} />
                        </div>
                        <div className='profile-image-camera' onClick={onProfileImageClickHandler}></div>
                    </div>
                    <InputBox message={nameMessage} messageError={nameMessageError} label='이름' type='text' placeholder='이름을 입력해주세요.' value={name} onChange={onNameChangeHandler} />
                    <InputBox message={nameMessage} messageError={nameMessageError} label='닉네임' type='text' placeholder='닉네임을 입력해주세요.' value={nickname} onChange={onNicknameChangeHandler} />
                    <div className='input-box'>
                        <div className='label'>비밀번호</div>
                        <div className='input-area'>
                            <button className='change-password-button' onClick={onChangePasswordButtonClickHandler}>비밀번호 변경</button>
                        </div>
                    </div>
                    {changePasswordModalOpen && (
                        <div className='password-modal'>
                            <div className='password-modal-box'>
                                <div className='password-modal-cancel-button' onClick={onChangePasswordModalCancel}>x</div>
                                <div className='password-modal-input-container'>
                                    <InputBox message={passwordMessage} messageError={passwordMessageError} label='기존 비밀번호' type='password' placeholder='기존 비밀번호를 입력해주세요.' value={password} onChange={onPasswordChangeHandler} />
                                    <InputBox message={changePasswordMessage} messageError={changePasswordMessageError} label='새 비밀번호' type='password' placeholder='새 비밀번호를 입력해주세요.' value={changePassword} onChange={onChangePasswordChangeHandler} />
                                    <InputBox message={chkPasswordMessage} messageError={chkPasswordMessageError} label='비밀번호 확인' type='password' placeholder='비밀번호를 다시 입력해주세요.' value={chkPassword} onChange={onChkPasswordChangeHandler} />
                                    <button className='password-update-button' onClick={onUpdatePasswordButtonClickHandler}>수정</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='input-box'>
                        <div className='label'>전화번호</div>
                        <div className='input-area'>
                            <input className='input' value={telNumber} readOnly />
                            <button className='change-tel-button' onClick={onTelNumberChangeButtonClickHandler}>전화번호 변경</button>
                        </div>
                    </div>
                    {modalOpen && (
                        <div className='modal'>
                            <div className='modal-box'>
                                <div className='modal-cancel-button' onClick={onCancelClickHandler}>x</div>
                                <div className='modal-input-container'>
                                    <InputBox message={changeTelNumberMessage} messageError={changeTelNumberMessageError} label='전화번호' type='text' placeholder='전화번호를 입력해주세요.' value={changeTelNumber} buttonName='인증번호 전송' onChange={onChangeTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                                    {isSend && <InputBox message={authNumberMessage} messageError={authNumberMessageError} label='인증번호' type='text' placeholder='인증번호를 입력해주세요.' value={authNumber} buttonName='인증번호 확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />}
                                    <button className='telNumber-update-button' onClick={onUpdateTelNumberButtonClickHandler}>수정</button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='button-container'>
                        <button className='update-button' onClick={onUpdateButtonClickHandler}>수정</button>
                        <button className='cancel-button' onClick={onUpdateCancelButtonClickHandler}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    );
}    