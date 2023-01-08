import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";

import { fetchPostsByCategory } from "../reducers/postsSlice";

import { Posts } from "./posts";
import { LoadingSpinner } from "./loading";
import { Error } from "./error";


export const Categories = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchPostsByCategory(params.categories!));
    }, [dispatch, params]);

    const postsStatus = useAppSelector(state => state.posts);
    const posts = postsStatus.posts;

    if (postsStatus.isLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (postsStatus.err) {
        return (
            <Error error={postsStatus.err} />
        );
    } else if (posts.length > 0) {
        return (
            <div>
                <Container>
                    <h1 className="mt-3 white-text">Categories: {params.categories!.split('&').reduce((x, y) => x + y + ", ", "").slice(0, -2)}</h1>
                </Container>
                <Posts posts={posts} />
            </div>
        )
    } else {
        return (
            <div>No results found for: {params.categories}</div>
        );
    }
}