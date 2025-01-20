import React, { useEffect, useState } from 'react';
import { TbArrowBarToUp } from 'react-icons/tb';
import './style.css';

export default function ScrollTopButton() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className='scroll-top-button'>
            {isVisible && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    <TbArrowBarToUp />
                </button>
            )}
        </div>
    );
}
