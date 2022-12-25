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


export const Categories = () => {
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPostsByCategory(params.categories));
    }, []);

    const [order, setOrder] = useState(0);

    const posts = useSelector(state => state.posts).posts;

    const sortLatest = () => {
        if (order !== 0) {
            setOrder(0);
            sortPosts();
        } 
    }

    const sortEarliest = () => {
        if (order !== 1) {
            setOrder(1);
            sortPosts();
        } 
    }

    // sorts posts array in selected order
    const sortPosts = () => {
        const postCopy = JSON.parse(JSON.stringify(posts))
        // Latest to Earliest by date
        if (order === 0) {
            postCopy.sort((a, b) => {
                return Date.parse(b.created_at) - Date.parse(a.created_at);
            });
        }
        // Earliest to Latest by date
        else {
            postCopy.sort((a, b) => {
                return Date.parse(a.created_at) - Date.parse(b.created_at);
            });
        }
        return postCopy;
    }

    if (posts.length > 0) {
        const postsList = sortPosts().map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>
                                @<Link to={`/users/${post.user.id}`}>{post.user.username}</Link>, {post.created_at}
                            </Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0, -2)}</Card.Subtitle>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{post.body.substring(0, 100)}</Card.Text>
                    <div className="d-flex justify-content-end">
                        <Button variant='success' className="me-2">Like</Button>
                        <Button variant='danger' className="me-2">Dislike</Button>
                        <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                        <Button variant='secondary'>Save</Button>
                    </div>
                </Card.Body>
            </Card>
        ))

        return (
            <Container className="col-8 mt-3">
                <Row>
                    <Container>
                        <Container className="col-8 float-start align-contents-left">
                            <h5>Categories: {params.categories.split('&').reduce((x, y) => x + y + ", ", "").slice(0, -2)}</h5>
                        </Container>
                        <Button variant="primary" className="float-end" onClick={sortEarliest}>Earliest</Button>
                        <Button variant="primary" className="float-end me-1" onClick={sortLatest}>Latest</Button>
                    </Container>
                </Row>
                <Container>
                    {postsList}
                </Container>
            </Container>
        )
    } else {
        return (
            <div>No results found for: {params.categories}</div>
        );
    }
}