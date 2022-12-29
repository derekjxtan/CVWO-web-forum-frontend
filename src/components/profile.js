import React, { useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';

import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../reducers/profileSlice";
import { Posts } from "./posts";
import { Replies } from "./replies";


export const Profile = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const userStatus = useSelector(state => state.user)
    const profile = useSelector(state => state.profile).profile

    const [view, setView] = useState(0);

    useEffect(() => {
        dispatch(fetchProfile(parseInt(params.userId)));
    }, [])

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

    if (userStatus.isAuthenticated && profile) {
        return (
            <div>
                <h1>Profile</h1>
                <h3>{profile.username}</h3>
                {
                    profile.id === userStatus.user.id
                    ?
                        <div>
                            <Button variant="primary" active={view===0} onClick={displayPosts}>Posts</Button>
                            <Button variant="primary" active={view===1} className="ms-2" onClick={displayReplies}>Replies</Button>
                            <Button variant="primary" active={view===2} className="ms-2" onClick={displayLikes}>Liked</Button>
                            <Button variant="primary" active={view===3} className="ms-2" onClick={displayDislikes}>Disliked</Button>
                            <Button variant="primary" active={view===4} className="ms-2" onClick={displaySaves}>Saved</Button>
                        </div>
                    :  
                        <div>
                            <Button variant="primary" active={view} onClick={displayPosts}>Posts</Button>
                            <Button variant="primary" active={!view} className="ms-2" onClick={displayReplies}>Replies</Button>
                        </div>
                }
                {
                    view === 0
                    ?
                        <Posts posts={profile.posts} />
                    : view === 1
                    ?
                        <Replies replies={profile.replies} />
                    : view === 2
                    ?
                        <Posts posts={userStatus.user.liked} />
                    : view === 3
                    ?
                        <Posts posts={userStatus.user.disliked} />
                    :
                        <Posts posts={userStatus.user.saved} />
                }
            </div>
        )
    } else {
        return (
            <h1 className="mt-3">Login to View</h1>
        )
    }
}