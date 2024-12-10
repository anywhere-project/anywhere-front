import React, { useState } from 'react'
import './style.css';
import { motion } from 'framer-motion';

interface SlotReelProps {
    values: string[]; // 릴의 항목들
    spinning: boolean;
    speed: number; // 회전 속도
    delay: number; // 애니메이션 지연
}

function SlotReel({ values, spinning, speed, delay }: SlotReelProps) {
    return (
        <div className="reel">
            <motion.div
                className="reel-numbers"
                animate={spinning ? { y: [-1500, 0] } : { y: 0 }}
                transition={{
                    duration: speed,
                    delay: delay,
                    ease: "easeInOut",
                }}
            >
                {values.map((value, index) => (
                    <div className="reel-item" key={index}>
                        {value}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function Main() {
    
    const [spinning, setSpinning] = useState(false);
    const [results, setResults] = useState<string[][]>([]);
    const [speeds, setSpeeds] = useState<number[]>([]);
    const [delays, setDelays] = useState<number[]>([]);

    // 각 릴의 데이터
    const regions = ['서울', '부산', '제주', '광주', '대구'];
    const attractions = ['경복궁', '부산타워', '한라산', '전주한옥마을', '대구엑스코'];
    const foods = ['김밥', '치킨', '비빔밥', '떡볶이', '순두부찌개'];
    const missions = ['사진 찍기', '음식 먹기', '기념품 사기', '무지개 찾기', '명소 방문하기'];

    const handleSpin = () => {
        setSpinning(true);

        // 각 릴의 속도와 지연 시간 설정
        const newSpeeds = Array(4).fill(0).map(() => Math.random() * 2 + 1);
        const newDelays = Array(4).fill(0).map(() => Math.random() * 1);

        setSpeeds(newSpeeds);
        setDelays(newDelays);

        // 각 릴의 내용을 랜덤하게 설정
        const newResults = [
            regions.sort(() => Math.random() - 0.5).slice(0, 5),
            attractions.sort(() => Math.random() - 0.5).slice(0, 5),
            foods.sort(() => Math.random() - 0.5).slice(0, 5),
            missions.sort(() => Math.random() - 0.5).slice(0, 5),
        ];

        // 결과를 즉시 업데이트하여 애니메이션 시작 전에 표시
        setResults(newResults);

        // 가장 긴 속도와 지연을 기준으로 총 애니메이션 지속 시간 계산
        const totalDuration = Math.max(...newSpeeds) * 1000 + Math.max(...newDelays) * 1000;

        // 애니메이션이 끝난 후 스피닝 상태를 false로 설정
        setTimeout(() => {
            setSpinning(false);
        }, totalDuration);
    };

    return (
        <div id="main-wrapper">
            <div className='main'>
                <div className='comment'>어딘가로 떠나고 싶지만</div>
                <div className='comment'>어디로 가야할지 모르시겠나요?</div>
                <div className='main-bottom'>
                    <div className="reels">
                        {results.map((values, index) => (
                            <SlotReel
                                key={index}
                                values={values}
                                spinning={spinning}
                                speed={speeds[index] || 1.5}
                                delay={delays[index] || 0}
                            />
                        ))}
                    </div>
                    <button onClick={handleSpin} disabled={spinning}>
                        클릭!
                    </button>
                </div>
            </div>
        </div>
    );
}