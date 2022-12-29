import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import Card  from "react-bootstrap/Card";
import Col  from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { fetchPostsByCategory } from "../reducers/postsSlice";
import { Posts } from "./posts";


export const Categories = () => {
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPostsByCategory(params.categories));
    }, []);

    const posts = useSelector(state => state.posts).posts;

    if (posts.length > 0) {
        return (
            <div>
                <Container>
                    <h5 className="mt-3 me-auto">Categories: {params.categories.split('&').reduce((x, y) => x + y + ", ", "").slice(0, -2)}</h5>
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