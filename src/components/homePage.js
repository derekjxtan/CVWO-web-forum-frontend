import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../reducers/postsSlice";
import { Error } from "./error";
import { LoadingSpinner } from "./loading";
import { Posts } from "./posts";

export const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch])

    const postsStatus = useSelector(state => state.posts)
    const posts = postsStatus.posts
    
    return (
        postsStatus.isLoading
        ?
            <LoadingSpinner />
        : postsStatus.err
        ?
            <Error error={postsStatus.err} />
        :
            <Posts posts={posts} />
    )
}