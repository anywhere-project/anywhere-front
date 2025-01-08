import { useSignInUserStore } from 'stores';
import './style.css';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { Review } from 'types';
import { ACCESS_TOKEN } from '../../constants';
import { useParams } from 'react-router-dom';


// interface: another user 정보 //
interface AnotherUser {
    userId: string;
    password: string;
    name: string;
    telNumber: string;
    nickname: string;
    profileImage: string;
    isAdmin: boolean;
    userStatus: string;
    }
export default function Mypage () {

    // state: 로그인 유저 정보 //
    const { signInUser } = useSignInUserStore();
    const [user, setUser] = useState<AnotherUser | null>(null);
    const { userId } = useParams<{ userId: string }>();

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // variable: accessToken
    const accessToken = cookies[ACCESS_TOKEN];

        // state: 내 후기 게시판 목록 상태 //
    const [reviewContents, setReviewContents] = useState<Review[]>([]);

    // variable: 작성자 여부 //
    const isOwner = (signInUser?.userId === userId) ? signInUser : user;

    const imageList = [
        'https://via.placeholder.com/150', // 이미지 주소 1
        'https://via.placeholder.com/150', // 이미지 주소 2
        'https://via.placeholder.com/150', // 이미지 주소 3
        'https://via.placeholder.com/150', // 이미지 주소 4
        'https://via.placeholder.com/150', // 이미지 주소 5
        'https://via.placeholder.com/150', // 이미지 주소 6
        'https://via.placeholder.com/150', // 이미지 주소 7
        'https://via.placeholder.com/150', // 이미지 주소 8
        'https://via.placeholder.com/150'  // 이미지 주소 9
    ];


    return (

        <div id='mypage-wrapper'>
            <div className='mypage'>
                <div className='mypage-container'>
                    <div className='mypage-top'>
                        <div className='mypage-nickname'>qwer1234</div>
                        <div className='mypage-tool'>설정</div>
                    </div>
                    <div className='mypage-middle'>
                        <div className='mypage-profile'></div>
                        <div className='mypage-board'>
                            <div className='board-category'>후기글</div>
                            <div className='board-category'>42개</div>

                        </div>
                    </div>
                    <div></div>
                    <div className='mypage-gallery'>
                            {imageList.map((image, index) => (
                            <img key={index} src={image} alt={`Gallery item ${index + 1}`} />
                        ))}
                    </div>

                </div>

            </div>
        </div>
    )
}