import React from 'react'
import './style.css';

export default function SideBar() {
    return (
        <div id="side-wrapper">
            <div className="side-container">
                <div className="menu-list">
                    <div className="menu-item">메인</div>
                    <div className="menu-item">후기게시판</div>
                    <div className="menu-item">추천게시판</div>
                    <div className="menu-item">마이페이지</div>
                </div>
            </div>
        </div>
    );
}