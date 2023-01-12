import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { fetchPosts } from "../reducers/postsSlice";

import { Error } from "./error";
import { LoadingSpinner } from "./loading";
import { Posts } from "./posts";

export const HomePage = () => {
    const dispatch = useAppDispatch();

    const [order, setOrder] = useState(0);

    const postsStatus = useAppSelector(state => state.posts)
    const posts = postsStatus.posts

    useEffect(() => {
        dispatch(fetchPosts(order));
    }, [dispatch, order])

    const getNewestPosts = () => {
        setOrder(0);
        dispatch(fetchPosts(0));
    }

    const getOldestPosts = async () => {
        setOrder(1);
        dispatch(fetchPosts(1));
    }

    const getMostLikesPosts = () => {
        setOrder(2);
        dispatch(fetchPosts(2));
    }

    const getMostDislikesPosts = () => {
        setOrder(3);
        dispatch(fetchPosts(3));
    }

    return (
        postsStatus.isLoading
        ?
            <LoadingSpinner />
        : postsStatus.err
        ?
            <Error error={postsStatus.err} />
        :   
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
    )
}