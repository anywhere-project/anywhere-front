import React, { useEffect, useState } from 'react';
import './style.css';
import { GetHashTagListResponseDto } from 'apis/dto/response/hashtag';
import { ResponseDto } from 'apis/dto/response';
import { HashTag } from 'types';
import { getHashTagListRequest } from 'apis';

export default function SideBar() {

    const [hashTagList, setHashTagList] = useState<HashTag[]>([]);

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
    }

    useEffect(() => {
        getHashTagListRequest().then(getHashTagListResponse);
    }, []);

    return (
        <div className="sidebar">
            <h3>인기 해시태그</h3>
            <div className="hash-tag-list">
                {hashTagList.length > 0 ? (
                    hashTagList.map((hashTag, index) => (
                        <div key={index} className="hash-tag">#{hashTag.tagName}</div>
                    ))
                ) : (
                    <div className="hash-tag">해시태그가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
