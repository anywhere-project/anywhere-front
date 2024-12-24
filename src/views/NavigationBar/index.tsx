import { useLocation, useNavigate } from 'react-router-dom';
import { useSignInUserStore } from '../../stores';
import { ChangeEvent, useEffect, useState } from 'react';

import { ACCESS_TOKEN, RECOMMEND_PATH, REVIEW_PATH, ROOT_PATH, SIGN_UP_PATH } from '../../constants';
import SignInRequestDto from '../../apis/dto/request/auth/sign-in.request.dto';
import { signInRequest } from '../../apis';
import { GetSignInResponseDto, SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import './style.css';
import { useCookies } from 'react-cookie';

function Dropdown() {

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // state: cookie 상태 관리
    const [cookies, setCookie, removeCookie] = useCookies();

    const navigator = useNavigate();
    
    const accessToken = cookies[ACCESS_TOKEN];

    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다.' : 
            responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { accessToken, expiration } = responseBody as SignInResponseDto;
        const expires = new Date(Date.now() + expiration * 1000);
        setCookie(ACCESS_TOKEN, accessToken, { path: '/', expires});

        setMessage(message);
        navigator(ROOT_PATH);
        setModalOpen(false);
    }

    // function: get sign in Response 처리 함수 //
    const getSingInResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' :
            responseBody.code === 'NI' ? '로그인 유저 정보가 존재하지 않습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '로그인 유저 정보를 불러오는데 문제가 발생했습니다.' : '유저 정보 가져오기!';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';

        if (!isSuccessed) {
            alert(message);
            removeCookie(ACCESS_TOKEN, { path: ROOT_PATH });
            setSignInUser(null);
            navigator(ROOT_PATH);
            return;
        }

        const { userId, password, name, nickname, telNumber, profileImage, isAdmin, userStatus } = responseBody as GetSignInResponseDto;
        setSignInUser({ userId, password, name, nickname, telNumber, profileImage, isAdmin, userStatus });
    };
    
    const onSignUpClickHandler = () => {
        navigator(SIGN_UP_PATH);
    }

    const onSignInClickHandler = () => {
        setModalOpen(true);
    }

    const onSignInCloseClickHandler = () => {
        setModalOpen(false);
    }

    // event handler: 로그인 키다운 이벤트 처리 //
    const onSignInEnterHandler = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSignInButtonClickHandler();
        }
    }
        
    const onSignInButtonClickHandler = async () => {
        if (!id || !password) {
            setMessage('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const requestBody: SignInRequestDto = {
            userId: id, password
        }

        signInRequest(requestBody).then(signInResponse);
    }

    // event handler: 로그아웃 버튼 클릭 이벤트 처리 //
    const onLogoutButtonClickHandler = () => {
        removeCookie('accessToken', { path: ROOT_PATH });

        navigator(ROOT_PATH);
        
        setId('');       
        setPassword(''); 
        setMessage('');  
    }

    // event handler: 아이디 입력 시 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    };

    // event handler: 비밀번호 입력 시 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    };

    // effect: cookie의 accessToken 값이 변경될 때마다 로그인 유저 정보를 요청하는 함수 //
    useEffect(() => {
        // if (accessToken) {
        //     getSignInRequest(accessToken).then(getSingInResponse);
        // } else {
        //     setSignInUser(null);
        // }
    }, [accessToken]);

    return (
        <div className="dropdown-wrapper">
            <div className="dropdown">
            {signInUser ? (
                <div className='dropdown-item' onClick={onLogoutButtonClickHandler}>로그아웃</div>
            ) : (
                <>
                    <div className="dropdown-item" onClick={onSignInClickHandler}>로그인</div>
                    <div className='dropdown-item' onClick={onSignUpClickHandler}>회원가입</div>
                </>
            )}
            </div>
            {modalOpen && (
                <div className="modal-backdrop" onClick={onSignInCloseClickHandler}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={onSignInCloseClickHandler}>✖</button>
                        <h2>SIGN IN</h2>
                        <form>
                            <div className="signin-group">
                                <div className='signin-label'>아이디</div>
                                <input className='signin-input' value={id} type="text" placeholder="아이디를 입력해주세요." onChange={onIdChangeHandler} onKeyDown={onSignInEnterHandler} />
                            </div>
                            <div className="signin-group">
                                <div className='signin-label'>비밀번호</div>
                                <input type="password" value={password} className="signin-input" placeholder="비밀번호를 입력해주세요." onChange={onPasswordChangeHandler} onKeyDown={onSignInEnterHandler} />
                            </div>
                            {message && <div className='signin-error'>{message}</div>}
                            <div className="signin-button" onClick={onSignInButtonClickHandler}>로그인</div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// component: Navigation Bar 컴포넌트 //
export default function NavigationBar() {

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    // state: path 상태 //
    const { pathname } = useLocation();

    const isReview = pathname.startsWith(REVIEW_PATH);
    const isRecommend = pathname.startsWith(RECOMMEND_PATH);

    const navigator = useNavigate();

    // event handler: 로고 클릭 이벤트 처리 //
    const onLogoClickHandler = () => {
        navigator(ROOT_PATH);
    };

    const onReviewClickHandler = () => {
        navigator(REVIEW_PATH);
    }

    const onRecommendClickHandler = () => {
        navigator(RECOMMEND_PATH);
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className='navigation-bar'>
            <div className='logo-name' onClick={onLogoClickHandler}>어디든가</div>
            <div className={`menu-review ${isReview ? 'review' : ''}`} onClick={onReviewClickHandler}>후기게시판</div>
            <div className={`menu-recommend ${isRecommend ? 'recommend' : ''}`} onClick={onRecommendClickHandler}>추천게시판</div>
            <div className="sign-in-wrapper">
                <div className="sign-in-button" onClick={toggleDropdown}></div>
                {dropdownOpen && <Dropdown />}
            </div>
        </div>
    )

}