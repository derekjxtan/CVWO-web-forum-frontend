import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { fetchPosts } from "../reducers/postsSlice";

import { Error } from "./error";
import { LoadingSpinner } from "./loading";
import { Posts } from "./posts";

export const HomePage = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch])

    const postsStatus = useAppSelector(state => state.posts)
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