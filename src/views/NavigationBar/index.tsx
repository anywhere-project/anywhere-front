import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSignInUserStore } from '../../stores';
import { ChangeEvent, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, RECOMMEND_PATH, REVIEW_PATH, ROOT_PATH, SIGN_UP_PATH } from '../../constants';
import SignInRequestDto from '../../apis/dto/request/auth/sign-in.request.dto';
import { signInRequest } from '../../apis';
import { SignInResponseDto } from '../../apis/dto/response/auth';
import { ResponseDto } from '../../apis/dto/response';
import './navi.css';

function Dropdown() {

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // state: cookie 상태 관리
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN]);

    const navigator = useNavigate();

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

        setMessage('');
        navigator(ROOT_PATH);
    }
    
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

    return (
        <div className="dropdown-wrapper">
            <div className="dropdown">
                <button className="dropdown-item" onClick={onSignInClickHandler}>
                    로그인
                </button>
                <button className="dropdown-item" onClick={onSignUpClickHandler}>
                    회원가입
                </button>
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

    // state: 로그인 유저 정보 상태 //
    const { signInUser, setSignInUser } = useSignInUserStore();

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const accessToken = queryParam.get('accessToken');
    const expiration = queryParam.get('expiration');

    const [dropdownOpen, setDropdownOpen] = useState(false);

    // state: path 상태 //
    const { pathname } = useLocation();

    // state: cookie 상태 관리
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN]);

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
                <div className='sign-in-button' onClick={toggleDropdown}></div>
                {dropdownOpen && <Dropdown />}
        </div>
    )

}