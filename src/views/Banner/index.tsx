import React, { useEffect, useState } from 'react'
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';




export default function Banner() {

    const navigator = useNavigate();
    const location = useLocation();

    const [activeBanner, setActiveBanner] = useState<string | null>(null);

    useEffect(() => {
        if (location.pathname === '/recommend/attraction') {
            setActiveBanner('locals');
        } else if (location.pathname === '/recommend/food') {
            setActiveBanner('foods');
        } else if (location.pathname === '/recommend/mission') {
            setActiveBanner('missions');
        }
    }, [location.pathname]);

    const handleBannerClick = (banner: string, path: string) => {
        setActiveBanner(banner);
        navigator(path);
    };

    return (
        <>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            <div id="banner-container">
                <div
                    className={`locals-banner ${activeBanner === 'locals' ? 'active' : ''}`}
                    onClick={() => handleBannerClick('locals', '/recommend/attraction')}
                >
                    <div className="banner-text">관광지</div>
                </div>
                <div
                    className={`foods-banner ${activeBanner === 'foods' ? 'active' : ''}`}
                    onClick={() => handleBannerClick('foods', '/recommend/food')}
                >
                    <div className="banner-text">먹거리</div>
                </div>
                <div
                    className={`missions-banner ${activeBanner === 'missions' ? 'active' : ''}`}
                    onClick={() => handleBannerClick('missions', '/recommend/mission')}
                >
                    <div className="banner-text">미션</div>
                </div>
            </div>
        </>
    );
}