import React, { useEffect, useState } from 'react';
import { GetHashTagListResponseDto } from 'apis/dto/response/hashtag';
import { ResponseDto } from 'apis/dto/response';
import { HashTag } from 'types';
import './style.css';
import { getHashTagListRequest } from 'apis';

export default function HashTagBar() {
    const [hashTagList, setHashTagList] = useState<HashTag[]>([]);
    const [sidebarTop, setSidebarTop] = useState<number>(670);

    const handleScroll = () => {
        const scrollPosition = window.scrollY; 
        const height = window.innerHeight
        const newTop = Math.max(670, scrollPosition + height / 2 - 100);
        setSidebarTop(newTop);
    };

    const getHashTagListResponse = (responseBody: GetHashTagListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { hashTags } = responseBody as GetHashTagListResponseDto;
        setHashTagList(hashTags);
    };


    useEffect(() => {
        getHashTagListRequest().then(getHashTagListResponse); 
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); 
        };
    }, []);

    return (
        <div className='hashtag-bar' style={{ top: `${sidebarTop}px` }}>
            <div className='hash-tag-title'>🔥현재 인기 키워드는?</div>
            <hr />
            <div className="hash-tag-list">
                {hashTagList.length > 0 ? (
                    hashTagList.map((hashTag, index) => (
                        <div key={index} className="hash-tag">{index + 1}. #{hashTag.tagName}</div>
                    ))
                ) : (
                    <div className="hash-tag">해시태그가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
