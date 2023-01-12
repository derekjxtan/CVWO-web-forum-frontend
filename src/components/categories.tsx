import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { fetchPostsByCategory } from "../reducers/postsSlice";

import { Posts } from "./posts";
import { LoadingSpinner } from "./loading";
import { Error } from "./error";


export const Categories = () => {
    const params = useParams();
    const dispatch = useAppDispatch();

    const [order, setOrder] = useState(0);

    const postsStatus = useAppSelector(state => state.posts);
    const posts = postsStatus.posts;

    useEffect(() => {
        dispatch(fetchPostsByCategory(params.categories!));
    }, [dispatch, params]);

    const getNewestPosts = () => {
        setOrder(0);
        dispatch(fetchPostsByCategory(params.categories!, 0));
    }

    const getOldestPosts = async () => {
        setOrder(1);
        dispatch(fetchPostsByCategory(params.categories!, 1));
    }

    const getMostLikesPosts = () => {
        setOrder(2);
        dispatch(fetchPostsByCategory(params.categories!, 2));
    }

    const getMostDislikesPosts = () => {
        setOrder(3);
        dispatch(fetchPostsByCategory(params.categories!, 3));
    }

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
                <Col lg={8} xs={12} className='container mt-3'>
                    <Row>
                        <Container>
                            <Button variant="primary" className="float-end" onClick={getNewestPosts} active={order === 0}>Newest</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getOldestPosts} active={order === 1}>Oldest</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getMostLikesPosts} active={order === 2}>Most Liked</Button>
                            <Button variant="primary" className="float-end me-1" onClick={getMostDislikesPosts} active={order === 3}>Most Disliked</Button>
                        </Container>
                    </Row>
                    <Posts posts={posts} />
                </Col>
            </div>
        )
    } else {
        return (
            <div>No results found for: {params.categories}</div>
        );
    }
}