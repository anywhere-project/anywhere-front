import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IdCheckRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "../../apis/dto/request/auth";
import { idCheckRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from "../../apis";
import './style.css';
import { ResponseDto } from "../../apis/dto/response";
import SignUpBox from "../../components/signup";

export default function SignUp() {

    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [chkPassword, setChkPassword] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [nameMessage, setNameMessage] = useState<string>('');
    const [nicknameMessage, setNicknameMessage] = useState<string>('');
    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [chkPasswordMessage, setChkPasswordCheckMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    const [nameMessageError, setNameMessageError] = useState<boolean>(false);
    const [nicknameMessageError, setNicknameMessageError] = useState<boolean>(false);
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [chkPasswordMessageError, setChkPasswordCheckMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSend, setSend] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // 회원가입 가능 여부
    const isComplete = name && id && nickname && isCheckedId && password && chkPassword && isMatchedPassword && isCheckedPassword
        && telNumber && isSend && authNumber && isCheckedAuthNumber;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 취소 버튼 클릭 이벤트 처리 //
    const onCancleClickHandler = () => {
        navigator('/');
    };
    
    // function: 아이디 중복 확인 함수 //
    const idCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'DI' ? '중복된 아이디입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '사용 가능한 아이디입니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setIdMessage(message);
        setIdMessageError(!isSuccessed);
        setCheckedId(isSuccessed);
    }

    // function : 전화번호 중복 확인 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' : 
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' : 
            responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SU' ? '사용 가능한 전화번호입니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSend(isSuccessed);
    }
    
    // function: 인증번호 성공 확인 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '인증번호가 확인되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
    }

    // function: 회원가입 성공 확인 함수 //
    const signUpResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
            responseBody.code === 'DI' ? '중복된 아이디입니다.' :
            responseBody.code === 'DT' ? '중복된 전화번호입니다.' :
            responseBody.code === 'TAF' ? '전화번호 인증에 실패했습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
            responseBody.code === 'SU' ? '가입이 완료되었습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (isSuccessed) {
            alert(message);
            return;
        }
    }

    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
        setNameMessage('');
    }

    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNickname(value);
        setNicknameMessage('');
    }

    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        setCheckedId(false);
        setIdMessage('');
    }

    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        const message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.';
        setPasswordMessage(message);
        setPasswordMessageError(!isMatched);
        setMatchedPassword(isMatched);
    }

    const onChkPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setChkPassword(value);
    }

    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);
        setSend(false);
        setTelNumberMessage('');
    }

    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setCheckedAuthNumber(false);
        setAuthNumberMessage('');
    }

    // eventh handler: 아이디 중복 확인 버튼 클릭 핸들러 //
    const onIdCheckClickHandler = () => {
        if (!id) return;

        const requestBody: IdCheckRequestDto = { userId: id };

        idCheckRequest(requestBody).then(idCheckResponse);
    }

    // event handler: 인증번호 전송 버튼 클릭 핸들러 //
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) {
            setTelNumberMessage('숫자 11자를 입력해주세요.');
            return;
        }

        const pattern = /^[0-9]{11}$/;
        const isMatched = pattern.test(telNumber);
        if (!isMatched) {
            setTelNumberMessage('숫자 11자를 입력해주세요.');
            setTelNumberMessageError(true);
            return;
        }

        const requestBody: TelAuthRequestDto = { telNumber }

        telAuthRequest(requestBody).then(telAuthResponse);
    }

    // event handler: 인증번호 확인 버튼 클릭 핸들러 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;

        const requestBody: TelAuthCheckRequestDto = { telNumber, authNumber }

        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);
    }

    // event handler: 회원가입 버튼 클릭 핸들러 // 
    const onSignUpButtonClickHandler = () => {
        if (!id) {
            setIdMessageError(true);
            setIdMessage('필수 항목 값입니다.');
        }

        if (!name) {
            setNameMessageError(true);
            setNameMessage('필수 항목 값입니다.');
        }

        if (!nickname) {
            setNicknameMessageError(true);
            setNicknameMessage('필수 항목 값입니다.');
        }

        if (!password) {
            setPasswordMessageError(true);
            setPasswordMessage('필수 항목 값입니다.');
        }

        if (!chkPassword) {
            setChkPasswordCheckMessageError(true);
            setChkPasswordCheckMessage('필수 항목 값입니다.');
        }

        if (!telNumber) {
            setTelNumberMessageError(true);
            setTelNumberMessage('필수 항목 값입니다.');
        }

        if (!isComplete) {
            return;
        }

        const requestBody: SignUpRequestDto = {
            userId: id,
            name,
            nickname,
            password,
            telNumber,
            authNumber
        }

        signUpRequest(requestBody).then(signUpResponse);

        navigator('/');
    }

    // effect: 비밀번호 및 비밀번호 확인 변경시 이펙트 //
    useEffect(() => {
        if (!password || !chkPassword) return;

        const isEqual = password === chkPassword;
        const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
        setChkPasswordCheckMessage(message);
        setChkPasswordCheckMessageError(!isEqual);
        setCheckedPassword(isEqual);
    }, [password, chkPassword]);

    return (
        <div className="sign-up-page">
            <div className="sign-up-container">
                <h1 className="sign-up-title">회원가입</h1>
                <form className="sign-up-form">
                    <SignUpBox
                        label="아이디"
                        type="text"
                        placeholder="아이디를 입력해주세요."
                        value={id}
                        message={idMessage}
                        messageError={idMessageError}
                        onChange={onIdChangeHandler}
                        buttonName='중복확인'
                        onButtonClick={onIdCheckClickHandler}
                    />

                    
                    <SignUpBox
                        label="이름"
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={name}
                        message={nameMessage}
                        messageError={nameMessageError}
                        onChange={onNameChangeHandler}
                    />

                    <SignUpBox
                        label="닉네임"
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        value={nickname}
                        message={nicknameMessage}
                        messageError={nicknameMessageError}
                        onChange={onNicknameChangeHandler}
                    />

                    <SignUpBox
                        label="비밀번호"
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        message={passwordMessage}
                        messageError={passwordMessageError}
                        onChange={onPasswordChangeHandler}
                    />

                    <SignUpBox
                        label="비밀번호 확인"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요."
                        value={chkPassword}
                        message={chkPasswordMessage}
                        messageError={chkPasswordMessageError}
                        onChange={onChkPasswordChangeHandler}
                    />

                    <SignUpBox
                        label="전화번호"
                        type="text"
                        placeholder="전화번호를 입력해주세요."
                        value={telNumber}
                        message={telNumberMessage}
                        messageError={telNumberMessageError}
                        onChange={onTelNumberChangeHandler}
                        buttonName="인증번호 전송"
                        onButtonClick={onTelNumberSendClickHandler}
                    />

                    {isSend &&
                    <SignUpBox
                        label="인증번호"
                        type="text"
                        placeholder="인증번호 4자리를 입력해주세요."
                        value={authNumber}
                        message={authNumberMessage}
                        messageError={authNumberMessageError}
                        onChange={onAuthNumberChangeHandler}
                        buttonName="인증번호 확인"
                        onButtonClick={onAuthNumberCheckClickHandler}
                    />}

                    <div className="sign-up-button-area">
                        <button className="sign-up-button" type="button" onClick={onSignUpButtonClickHandler}>회원가입</button>
                        <button className="sign-up-cancel-button" type="button" onClick={onCancleClickHandler}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}