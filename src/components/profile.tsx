import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useParams } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { fetchProfile, updateProfileDisliked, updateProfileLiked, updateProfilePosts, updateProfileReplies, updateProfileSaved } from "../reducers/profileSlice";

import { Posts } from "./posts";
import { Replies } from "./replies";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";
import { Container } from "react-bootstrap";
import { PostInterface, ReplyInterface } from "../app/interfaces";


export const Profile = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    const userStatus = useAppSelector(state => state.user)
    const profile = useAppSelector(state => state.profile)

    const [view, setView] = useState(0);
    const [order, setOrder] = useState(-1);

    useEffect(() => {
        dispatch(fetchProfile(parseInt(params.userId!)));
    }, [dispatch, params])

    const displayPosts = () => {
        if (view !== 0) {
            setView(0);
        }
    }

    const displayReplies = () => {
        if (view !== 1) {
            setView(1);
        }
    }

    const displayLikes = () => {
        if (view !== 2) {
            setView(2);
        }
    }

    const displayDislikes = () => {
        if (view !== 3) {
            setView(3);
        }
    }

    const displaySaves = () => {
        if (view !== 4) {
            setView(4);
        }
    }

    const sort = (order: number = 0) => {
        // latest
        if (order === 0) {
            dispatch(updateProfilePosts(JSON.parse(JSON.stringify(profile.posts)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            })));
            dispatch(updateProfileReplies(JSON.parse(JSON.stringify(profile.replies)).sort((a: ReplyInterface, b: ReplyInterface) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            })));
            dispatch(updateProfileLiked(JSON.parse(JSON.stringify(profile.liked)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            })));
            dispatch(updateProfileDisliked(JSON.parse(JSON.stringify(profile.disliked)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            })));
            dispatch(updateProfileSaved(JSON.parse(JSON.stringify(profile.saved)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            })));
        }
        // earliest 
        else if (order === 1) {
            dispatch(updateProfilePosts(JSON.parse(JSON.stringify(profile.posts)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            })));
            dispatch(updateProfileReplies(JSON.parse(JSON.stringify(profile.replies)).sort((a: ReplyInterface, b: ReplyInterface) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            })));
            dispatch(updateProfileLiked(JSON.parse(JSON.stringify(profile.liked)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            })));
            dispatch(updateProfileDisliked(JSON.parse(JSON.stringify(profile.disliked)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            })));
            dispatch(updateProfileSaved(JSON.parse(JSON.stringify(profile.saved)).sort((a: PostInterface, b: PostInterface) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            })));
        }
        // most liked
        else if (order === 2) {
            dispatch(updateProfilePosts(JSON.parse(JSON.stringify(profile.posts)).sort((a: PostInterface, b: PostInterface) => {
                return b.likes - a.likes;
            })));
            dispatch(updateProfileReplies(JSON.parse(JSON.stringify(profile.replies)).sort((a: ReplyInterface, b: ReplyInterface) => {
                return b.likes - a.likes;
            })));
            dispatch(updateProfileLiked(JSON.parse(JSON.stringify(profile.liked)).sort((a: PostInterface, b: PostInterface) => {
                return b.likes - a.likes;
            })));
            dispatch(updateProfileDisliked(JSON.parse(JSON.stringify(profile.disliked)).sort((a: PostInterface, b: PostInterface) => {
                return b.likes - a.likes;
            })));
            dispatch(updateProfileSaved(JSON.parse(JSON.stringify(profile.saved)).sort((a: PostInterface, b: PostInterface) => {
                return b.likes - a.likes;
            })));
        }
        // most disliked
        else {
            dispatch(updateProfilePosts(JSON.parse(JSON.stringify(profile.posts)).sort((a: PostInterface, b: PostInterface) => {
                return b.dislikes - a.dislikes;
            })));
            dispatch(updateProfileReplies(JSON.parse(JSON.stringify(profile.replies)).sort((a: ReplyInterface, b: ReplyInterface) => {
                return b.dislikes - a.dislikes;
            })));
            dispatch(updateProfileLiked(JSON.parse(JSON.stringify(profile.liked)).sort((a: PostInterface, b: PostInterface) => {
                return b.dislikes - a.dislikes;
            })));
            dispatch(updateProfileDisliked(JSON.parse(JSON.stringify(profile.disliked)).sort((a: PostInterface, b: PostInterface) => {
                return b.dislikes - a.dislikes;
            })));
            dispatch(updateProfileSaved(JSON.parse(JSON.stringify(profile.saved)).sort((a: PostInterface, b: PostInterface) => {
                return b.dislikes - a.dislikes;
            })));
        }
    }

    const getLatest = () => {
        if (order !== 0) {
            setOrder(0);
            sort(0);
        }
    }

    const getEarliest = () => {
        if (order !== 1) {
            setOrder(1);
            sort(1);
        }
    }

    const getMostLikes = () => {
        if (order !== 2) {
            setOrder(2);
            sort(2);
        }
    }

    const getMostDislikes = () => {
        if (order !== 3) {
            setOrder(3);
            sort(3);
        }
    }

    if (profile.isLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (profile.err) {
        return (
            <Error error={profile.err}  />
        );
    } else {
        return (
            <div>
                <h1 className="white-text">Profile</h1>
                <h3 className="white-text">{profile.username}</h3>
                {
                    userStatus.isAuthenticated && profile.id === userStatus.id
                    ?
                        <div>
                            <Button active={view===0} className="header-button" onClick={displayPosts}>
                                <FontAwesomeIcon icon={solid('rectangle-list')}/> Posts
                            </Button>
                            <Button active={view===1} className=" header-button ms-2" onClick={displayReplies}>
                                <FontAwesomeIcon icon={solid('reply')}/> Replies
                            </Button>
                            <Button active={view===2} className="header-button ms-2" onClick={displayLikes}>
                                <FontAwesomeIcon icon={solid('thumbs-up')}/> Liked
                            </Button>
                            <Button active={view===3} className="header-button ms-2" onClick={displayDislikes}>
                                <FontAwesomeIcon icon={solid('thumbs-down')}/> Disliked
                            </Button>
                            <Button active={view===4} className="header-button ms-2" onClick={displaySaves}>
                                <FontAwesomeIcon icon={solid('bookmark')}/> Saved
                            </Button>
                        </div>
                    :  
                        <div>
                            <Button active={view===0} className="header-button" onClick={displayPosts}>
                                <FontAwesomeIcon icon={solid('rectangle-list')}/> Posts
                            </Button>
                            <Button active={view===1} className="header-button ms-2" onClick={displayReplies}>
                                <FontAwesomeIcon icon={solid('reply')}/> Replies
                            </Button>
                        </div>
                }
                <Col lg={8} xs={12} className='container mt-3'>
                    <Row>
                        <Container>
                            <Button variant="primary" className="float-end" onClick={getLatest} active={order === 0}>Newest</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getEarliest} active={order === 1}>Oldest</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getMostLikes} active={order === 2}>Most Liked</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getMostDislikes} active={order === 3}>Most Disliked</Button>
                        </Container>
                    </Row>
                    {
                        view === 0
                        ?
                            <Posts posts={profile.posts!} />
                        : view === 1
                        ?
                            <Replies replies={profile.replies!} />
                        : view === 2
                        ?
                            <Posts posts={profile.liked!} />
                        : view === 3
                        ?
                            <Posts posts={profile.disliked!} />
                        :
                            <Posts posts={profile.saved!} />
                    }
                </Col>
            </div>
        )
    }
}