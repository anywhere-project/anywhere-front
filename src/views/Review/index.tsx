import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import type { Review, ReviewComment } from 'types';
import { ResponseDto } from 'apis/dto/response';
import GetUserInfoResponseDto from 'apis/dto/response/user/get-user-info.response.dto';
import { deleteReviewCommentRequest, getReviewCommentListRequest, getReviewListRequest, getSignInRequest, getUserInfoRequest, postReviewLikeRequest } from 'apis';
import { FaHeart, FaPencilAlt, FaRegHeart } from "react-icons/fa";
import 'swiper/swiper-bundle.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import GetReviewPostListResponseDto from 'apis/dto/response/review/get-review-list.response.dto';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, REVIEW_UPDATE_PATH } from "../../constants";
import { useSignInUserStore } from 'stores';
import { GetSignInResponseDto } from 'apis/dto/response/auth';
import { useNavigate } from 'react-router-dom';
import GetReviewCommentListResponseDto from 'apis/dto/response/review/get-review-comment-list.response.dto';

// interface: 후기 리스트 아이템 Properties //
interface TableRowProps {
    review: Review;
    userLoginId: string;
}

// interface: 후기 댓글 리스트 아이템 Properties //
interface CommentRowProps {
    reviewComment: ReviewComment;
    userLoginId: string;
}

function CommentRowProps({reviewComment, userLoginId}: CommentRowProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

     // state: 유저 상태 //
     const userId = reviewComment.reviewCommentWriter;
     const [nickName, setNickName] = useState<string>('');

     // state: 댓글 상태 //
     const [isDeleted, setIsDeleted] = useState(reviewComment.isDeleted);

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

    // function: 후기 댓글 삭제하기 요청 함수 //
    const deleteReviewCommentResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NRV' ? '존재하지 않는 후기입니다.' :
            responseBody.code === 'NRC' ? '존재하지 않는 댓글입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
            responseBody.code === 'NP' ? '권한이 없습니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';
        
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        setIsDeleted(true);
    }

    // event handler: 후기 댓글 삭제 작성 이벤트 처리 //
    const deleteReviewCommentButtonClickHandler = async () => {
        if (!accessToken || !reviewComment.reviewId) return;
        
        const confirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!confirm) return;

        deleteReviewCommentRequest(reviewComment.reviewId, reviewComment.reviewCommentId, accessToken).then(deleteReviewCommentResponse);
    };

    // effect: user 상태가 바뀔 때 userInfo 상태 업데이트
    useEffect(() => {
        if(!userId) return;
        getUserInfoRequest(userId).then(getUserInfoResponse);
    }, [userId]);

    return (
        <div className='review-comment'>
            <div className='comment-first-line'>{nickName}</div>
            <div className='comment-second-line'>
                {Boolean(reviewComment.isDeleted) ? '삭제된 댓글입니다.' : reviewComment.reviewCommentContent}
            </div>
            <div className='comment-third-line'>
                <div className='comment-date margin-right'>{reviewComment.reviewCommentCreatedAt}</div>
                <div className='post-comment-button margin-right'>댓글 달기</div>
                <div className='update-button margin-right'>
                    {!Boolean(reviewComment.isDeleted) && userLoginId === userId ? '댓글 수정' : ''}
                </div>
                <div className='delete-button' onClick={deleteReviewCommentButtonClickHandler}>
                    {!Boolean(reviewComment.isDeleted) && userLoginId === userId ? '댓글 삭제' : ''}
                </div>
            </div>
        </div>
    )
}

function TableRow({review, userLoginId}: TableRowProps) {

    // state: cookie 상태 //
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 유저 상태 //
    const userId = review.reviewWriter;
    const [nickName, setNickName] = useState<string>('');

    // state: 후기 정보 상태 //
    const [images, setImages] = useState<string[]>([]);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [likes, setLikes] = useState<string[]>([]);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [comments, setComments] = useState<ReviewComment[]>([]);

    // state: 후기 모달 팝업 상태 //
    const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);

    // variable: 작성자 여부 //
    const isOwner =  userLoginId=== userId;

    // function: navigator 함수 //
    const navigator = useNavigate();

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

    // function: 좋아요 변경 버튼 처리 함수 //
    const postReviewLikeResponse = (responseBody: ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'VF' ? '유효하지 않은 데이터입니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'NI' ? '존재하지 않는 사용자입니다.' :
            responseBody.code === 'NRA' ? '존재하지 않는 관광지입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && (responseBody.code === 'LC' || responseBody.code === 'LUC');
        if (!isSuccessed) {
            alert(message);
            return;
        }

        setIsLiked(!isLiked);
    };

    // function: get review comment response 처리 함수 //
    const getReviewCommentListResponse = (responseBody: GetReviewCommentListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'NRV' ? '리뷰 게시글이 없습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { reviewComments } = responseBody as GetReviewCommentListResponseDto;
        setComments(reviewComments);
    }

    // event handler: 좋아요 변경 이벤트 처리 함수 //
    const onLikeButtonClickHandler = () => {
        postReviewLikeRequest(review.reviewId, accessToken).then(postReviewLikeResponse);
    }

    // event handler: 후기 모달 버튼 클릭 이벤트 처리 함수 //
    const onModalOpenHandler = () => {
        setCommentModalOpen(!commentModalOpen);
        if (commentModalOpen === false) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // event handler: 후기 작성 이벤트 처리 //
    const updatePostButtonClickHandler = async () => {
        navigator(REVIEW_UPDATE_PATH(review.reviewId));
    };

    // effect: user 상태가 바뀔 때 userInfo 상태 업데이트
    useEffect(() => {
        if(!userId) return;
        getUserInfoRequest(userId).then(getUserInfoResponse);
    }, [userId]);

    // effect: review 상태가 바뀔 때 images 상태 업데이트
    useEffect(() => {
        setImages(review.imageUrl.map((image) => image.imageUrl));
    }, [review]);

    // effect: review 상태가 바뀔 때 hashTags 상태 업데이트
    useEffect(() => {
        setHashTags(review.hashtags.map((hashtag) => hashtag));
    }, [review]);

    // effect: review 상태가 바뀔 때 hashTags 상태 업데이트
    useEffect(() => {
        setLikes(review.hashtags.map((like) => like));
    }, [review]);

    useEffect(() => {
        if (Array.isArray(review.likes)) {
            setIsLiked(review.likes.some((user) => user === userLoginId));
        } else {
            setIsLiked(false); // 기본값
        }
    }, [review, userLoginId]);

    // effect: 댓글 상태가 바뀔 때 comment 상태 업데이트
    useEffect(() => {
        getReviewCommentListRequest(review.reviewId).then(getReviewCommentListResponse);
    }, []);

    // render : 후기 게시글 리스트 렌더링 //
    return (
        <div className='review-content'>
            <div className='review-top'>
                <div className="review-writer">{nickName}</div>
                {isOwner && <FaPencilAlt onClick={updatePostButtonClickHandler} style={{cursor:'pointer'}}/>}
            </div>
            <div className='review-middle'>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation // 네비게이션 활성화
                    modules={[Navigation, Pagination]}
                >
                {images.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                        <img className='review-image' src={imageUrl} alt={`Image ${index}`} />
                    </SwiperSlide>
                ))}
                </Swiper>
            </div>
            <div className='review-bottom'>
                <div className='bottom-first-line'>
                    {accessToken && (
                        <div className="like-button" onClick={onLikeButtonClickHandler}>{isLiked ? <FaHeart color="red" /> : <FaRegHeart />}</div>
                    )}
                    <div className='hashTags'>
                        {hashTags.map((hashTag, index) => (
                            <span className='hashTag' key={index}>{hashTag}</span>
                        ))}
                    </div>
                </div>
                <div className='bottom-second-line' onClick={onModalOpenHandler}>
                    {review.reviewContent}
                </div>
                <div className='bottom-third-line'>
                    {review.reviewCreatedAt}
                </div>
            </div>
            {/* 후기 모달 */}
            {commentModalOpen &&
                <div className='modal'>
                    <div className='modal-box'>
                        <div className='modal-top'>
                            <div className='close-button' onClick={onModalOpenHandler}>X</div>
                        </div>
                        <div className='modal-middle'>
                            <div className="review-writer">{nickName}</div>
                            <div>{review.reviewContent}</div>
                            <div className='hashtags'>
                            {hashTags.map((hashTag, index) => (
                                <span className='hashTag' key={index}>{hashTag}</span>
                            ))}
                            </div>
                            <div className='post-date'>{review.reviewCreatedAt}</div>
                        </div>
                        <div className='modal-middle-comment'>
                            <div className='comment-box'>
                            {comments.map((reviewComment, index) => (
                                <CommentRowProps key={index} reviewComment={reviewComment} userLoginId={userLoginId}/>
                            ))}
                            </div>
                        </div>
                        <div className='modal-bottom'>
                            <input type="text" className='input-box'/>
                            <button className='comment-button'>게시</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
    
}

// component: 후기 리스트 화면 컴포넌트
export default function ReviewList() {

    // state: cookie 상태 //
    const [cookies] = useCookies();
    const accessToken = cookies[ACCESS_TOKEN];

    // state: 후기 정보 상태 //
    const [posts, setPosts] = useState<Review[]>([]);
    const [userId, setUserId] = useState<string>('');

    // state: 무한 스크롤 정보 상태 //
    const [visiblePosts, setVisiblePosts] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const observerRef = useRef(null);

    // function: get user info response 처리 함수 //
    const getSignInUserResponse = (responseBody: GetSignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다.' : 
            responseBody.code === 'AF' ? '잘못된 접근입니다.' : 
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }

        const { userId } = responseBody as GetSignInResponseDto;
        setUserId(userId);
    }

    // function: get review response 처리 함수 //
    const getReviewPostListResponse = (responseBody: GetReviewPostListResponseDto | ResponseDto | null) => {
        const message =
            !responseBody ? '서버에 문제가 있습니다.' :
            responseBody.code === 'AF' ? '잘못된 접근입니다.' :
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const { reviewPosts } = responseBody as GetReviewPostListResponseDto;
        setPosts(reviewPosts);
    }

    // function: 무한 스크롤 로드 함수 //
    const loadMorePosts = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisiblePosts((prev) => prev + 5); 
            setIsLoading(false);
        }, 1000);
    };

     // effect: 후기 정보 업데이트
    useEffect(() => {

        getSignInRequest(accessToken).then(getSignInUserResponse);

        // 페이지 새로 고침 시, 스크롤 위치 자동 복원 방지
        window.history.scrollRestoration = 'manual'; // 스크롤 위치 복원 방지
        
        getReviewListRequest().then(getReviewPostListResponse).then(() => {
            // 데이터 로딩 완료 후, 맨 위로 스크롤
            window.scrollTo(0, 0);
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMorePosts();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, []);

    // render : 후기 게시판 컴포넌트 렌더링 //
    return (
        <div className='review-post'>
            <div className='share-banner'>
                <p>나만의 여행 루트를 다른 사람들에게 함께 공유해 보세요!</p>
            </div>
            <div className='get-review'>
                {posts.slice(0, visiblePosts).map((reviewPost, index) => (
                    <TableRow key={index} review={reviewPost} userLoginId={userId}/>
                ))}
            </div>

            {isLoading && <div className="loading-spinner">Loading...</div>}
    
            <div ref={observerRef} style={{ height: "1px" }}></div>
        </div>
    )
}