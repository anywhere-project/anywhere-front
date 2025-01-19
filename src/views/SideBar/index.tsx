import React, { useEffect, useState } from 'react'
import './style.css';

export default function SideBar() {

    const [barPosition, setBarPosition] = useState<number>(720);

    const handleScroll = () => {
        const scrollPosition = window.scrollY; 
        const height = window.innerHeight
        const newTop = Math.max(720, scrollPosition + height / 2 - 100);
        setBarPosition(newTop);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
            <div className="side-container" style={{ top: `${barPosition}px` }}>
                <div className="menu-list">
                    <div className="menu-item">메인</div>
                    <div className="menu-item">후기게시판</div>
                    <div className="menu-item">추천게시판</div>
                    <div className="menu-item">마이페이지</div>
                </div>
            </div>
    );
};