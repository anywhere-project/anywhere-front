import React from 'react'
import './style.css'
import type { Review } from 'types';


// interface: 후기 리스트 아이템 Properties //
interface TableRowProps {
    review: Review;
    getReviewList: () => void;
}

function TableRow({review, getReviewList}: TableRowProps) {

    // render : 후기 게시글 리스트 렌더링 //
    return (
        <></>
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