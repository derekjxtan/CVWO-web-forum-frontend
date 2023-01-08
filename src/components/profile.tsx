import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useParams } from "react-router-dom";

import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { fetchProfile } from "../reducers/profileSlice";

import { Posts } from "./posts";
import { Replies } from "./replies";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";


export const Profile = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    const userStatus = useAppSelector(state => state.user)
    const profileStatus = useAppSelector(state => state.profile)
    const profile = profileStatus.profile

    const [view, setView] = useState(0);

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

    if (profile) {
        return (
            <div>
                <h1 className="white-text">Profile</h1>
                <h3 className="white-text">{profile.username}</h3>
                {
                    userStatus.isAuthenticated && profile.id === userStatus.id
                    ?
                        <div>
                            <Button variant="primary" active={view===0} onClick={displayPosts}>
                                <FontAwesomeIcon icon={solid('rectangle-list')}/> Posts
                            </Button>
                            <Button variant="primary" active={view===1} className="ms-2" onClick={displayReplies}>
                                <FontAwesomeIcon icon={solid('reply')}/> Replies
                            </Button>
                            <Button variant="primary" active={view===2} className="ms-2" onClick={displayLikes}>
                                <FontAwesomeIcon icon={solid('thumbs-up')}/> Liked
                            </Button>
                            <Button variant="primary" active={view===3} className="ms-2" onClick={displayDislikes}>
                                <FontAwesomeIcon icon={solid('thumbs-down')}/> Disliked
                            </Button>
                            <Button variant="primary" active={view===4} className="ms-2" onClick={displaySaves}>
                                <FontAwesomeIcon icon={solid('bookmark')}/> Saved
                            </Button>
                        </div>
                    :  
                        <div>
                            <Button variant="primary" active={view===0} onClick={displayPosts}>Posts</Button>
                            <Button variant="primary" active={view===1} className="ms-2" onClick={displayReplies}>Replies</Button>
                        </div>
                }
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
            </div>
        )
    } else if (profileStatus.isLoading) {
        return (
            <LoadingSpinner />
        )
    } else if (profileStatus.err) {
        return (
            <Error error={profileStatus.err}  />
        )
    } else {
        return (
            <h1 className="mt-3">Login to View</h1>
        )
    }
}