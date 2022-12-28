import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card  from "react-bootstrap/Card";
import Col  from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

import { fetchPosts, likePost, unlikePost, dislikePost, undislikePost, savePost, unsavePost } from "../reducers/postsSlice";


export const Posts = () => {
    const dispatch = useDispatch()

    const [order, setOrder] = useState(0);

    // find some way to handle missing dependency warning in eslint
    useEffect(() => {
        dispatch(fetchPosts());
    }, [])

    const posts = useSelector(state => state.posts).posts
    const userStatus = useSelector(state => state.user)
    
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

    // checks whether post has already been liked by user. If so call likePost, otherwise call unlikePost
    const handleLike = (post_id) => {
        if (userStatus.user.liked.find(post => post.id === post_id) === undefined) {
            dispatch(likePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(unlikePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

    // checks whether post has already been disliked by user. If so call dislikePost, otherwise call undislikePost
    const handleDislike = (post_id) => {
        if (userStatus.user.disliked.find(post => post.id === post_id) === undefined) {
            dispatch(dislikePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(undislikePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

    // checks whether post has already been saved by user. If so call savePost, otherwise call unsavePost
    const handleSave = (post_id) => {
        if (userStatus.user.saved.find(post => post.id === post_id) === undefined) {
            dispatch(savePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(unsavePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

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
                        <Card.Subtitle>Likes: {post.likes}, Dislikes: {post.dislikes}</Card.Subtitle>
                    </Col>
                </Row>
                <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>{post.body.substring(0, 100)}</Card.Text>
                    {
                        userStatus.isAuthenticated
                        ?
                            <div className="d-flex justify-content-end">
                                <Button variant='outline-success' className="me-2" onClick={() => handleLike(post.id)} 
                                    active={userStatus.user.liked.find(item => item.id === post.id) === undefined}>
                                        Like
                                </Button>
                                <Button variant='outline-danger' className="me-2" onClick={() => handleDislike(post.id)}
                                    active={userStatus.user.disliked.find(item => item.id === post.id) === undefined}>
                                        Dislike
                                </Button>
                                <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                                <Button variant='secondary' onClick={() => handleSave(post.id)}>Save</Button>
                            </div>
                        :
                            <div className="d-flex justify-content-end">
                                <Button variant='success' className="me-2">Like</Button>
                                <Button variant='danger' className="me-2">Dislike</Button>
                                <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                                <Button variant='secondary' onClick={() => handleSave(post.id)}>Save</Button>
                            </div>
                    }
            </Card.Body>
        </Card>
    ))

    return (
        <Container className="col-8 mt-3">
            <Row>
                <Container>
                    <Button variant="primary" className="float-end" onClick={sortEarliest}>Earliest</Button>
                    <Button variant="primary" className="float-end me-1" onClick={sortLatest}>Latest</Button>
                </Container>
            </Row>
            <Container>
                {postsList}
            </Container>
        </Container>
    ) 
}