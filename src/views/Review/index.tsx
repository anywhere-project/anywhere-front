import React from 'react'
import './style.css'
import type { Review } from 'types';


// interface: 후기 리스트 아이템 Properties //
interface TableRowProps {
    review: Review;
    getReviewList: () => void;
}

function TableRow({review, getReviewList}: TableRowProps) {

    

}

// component: 후기 리스트 화면 컴포넌트
export default function Review() {

    // render : 후기 게시판 컴포넌트 렌더링 //
    return (
        <div>
        </div>
    )