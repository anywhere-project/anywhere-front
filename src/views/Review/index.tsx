import React, { useEffect, useState } from 'react'
import './style.css'
import type { Review } from 'types';
import { ResponseDto } from 'apis/dto/response';
import GetUserInfoResponseDto from 'apis/dto/response/user/get-user-info.response.dto';
import { getUserInfoRequest } from 'apis';
import { FaPencilAlt } from "react-icons/fa";


// interface: 후기 리스트 아이템 Properties //
interface TableRowProps {
    review: Review;
    getReviewList: () => void;
}

function TableRow({review, getReviewList}: TableRowProps) {

    // state: 유저 상태 //
    const [nickName, setNickName] = useState<string>('');

    const userId = review.reviewWriter;

    // function: get user info response 처리 함수 //
    const getUserInfoResponse = (responseBody: GetUserInfoResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '내역을 입력해주세요.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { nickname } = responseBody as GetUserInfoResponseDto;
        setNickName(nickname);
    };

    // effect: user 상태가 바뀔 때 userInfo 상태 업데이트
    useEffect(() => {
        if(!userId) return;
        getUserInfoRequest(userId).then(getUserInfoResponse);
    }, [userId]);

    // render : 후기 게시글 리스트 렌더링 //
    return (
        <div className='review-post'>
            <div className='review-top'>
                <div className="review-writer">{nickName}</div>
                <FaPencilAlt />
            </div>
            <div className='review-middle'></div>
            <div className='review-bottom'></div>
        </div>
    )
    
}

// component: 후기 리스트 화면 컴포넌트
export default function ReviewList() {

    // render : 후기 게시판 컴포넌트 렌더링 //
    return (
        <div className='review-post'>
            <div className='share-banner'>
                <p>나만의 여행 루트를 다른 사람들에게 함께 공유해 보세요!</p>
            </div>
            <div className="review-content">

            </div>
        </div>
    )
}