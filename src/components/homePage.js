import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../reducers/postsSlice";
import { Posts } from "./posts";

export const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [])

    const posts = useSelector(state => state.posts).posts

    return (
        <Posts posts={posts} />
    )
}