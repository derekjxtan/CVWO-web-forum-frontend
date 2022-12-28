import React, { useEffect, useState } from "react";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { deletePost, deleteReply } from "../reducers/postsSlice";
import { fetchProfile } from "../reducers/profileSlice";


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

    // called when attempting to delete a post
    // dispatches deletePost function from postsSlice
    const handleDeletePost = (post_id) => {
        alert("Deleting post " + post_id);
        dispatch(deletePost(post_id));
    }

    // called when attempting to delete a reply
    // dispatches deleteReply function from postsSlice
    const handleDeleteReply = (reply_id) => {
        alert("Deleting reply " + reply_id);
        dispatch(deleteReply(reply_id));
    }

    var likesList = <div />
    var dislikesList = <div />
    var savesList = <div />

    if (userStatus.isAuthenticated && profile) {
        likesList = userStatus.user.liked.map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>{post.created_at}</Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: {post.likes}, Dislikes: {post.dislikes}</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
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
        ));

        dislikesList = userStatus.user.disliked.map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>{post.created_at}</Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: {post.likes}, Dislikes: {post.dislikes}</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
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
        ));

        savesList = userStatus.user.saved.map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>{post.created_at}</Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: {post.likes}, Dislikes: {post.dislikes}</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
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
        ));
    }
    
    if (profile) {
        const postsList = profile.posts.map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>{post.created_at}</Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: {post.likes}, Dislikes: {post.dislikes}</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{post.body.substring(0, 100)}</Card.Text>
                    <div className="d-flex justify-content-end">
                        {
                            !userStatus.isAuthenticated
                            ?
                                <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                            : userStatus.user.id === profile.id
                            ?
                                <div>
                                    <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                                    <Link to={`/posts/${post.id}/edit`} className='btn btn-success me-2'>Edit</Link>
                                    <Button variant="danger" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                                </div>
                            :
                                <div>
                                    <Button variant='success' className="me-2">Like</Button>
                                    <Button variant='danger' className="me-2">Dislike</Button>
                                    <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                                    <Button variant='secondary'>Save</Button>
                                </div>
                        }
                    </div>
                </Card.Body>
            </Card>
        ));

        const repliesList = profile.replies.map(reply => (
            <Card className="mt-3" key={reply.id}>
                <Card.Header>
                    <Card.Subtitle className="d-flex justify-content-start">{reply.created_at}</Card.Subtitle>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{reply.body}</Card.Text>
                    <div className="d-flex justify-content-end">
                        <Link to={`/posts/${reply.post_id}`} className='btn btn-primary me-2'>See Post</Link>
                        <Button variant="danger" onClick={() => handleDeleteReply(reply.id)}>Delete</Button>
                    </div>
                </Card.Body>
            </Card>
        ));

        return(
            <Container className="col-8">
                <h1>Profile</h1>
                <h3>{profile.username}</h3>
                {
                    profile.id === userStatus.user.id
                    ?
                        <div>
                            <Button variant="primary" active={view} onClick={displayPosts}>Posts</Button>
                            <Button variant="primary" active={!view} className="ms-2" onClick={displayReplies}>Replies</Button>
                            <Button variant="primary" className="ms-2" onClick={displayLikes}>Liked</Button>
                            <Button variant="primary" className="ms-2" onClick={displayDislikes}>Disliked</Button>
                            <Button variant="primary" className="ms-2" onClick={displaySaves}>Saved</Button>
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
                        <div>{postsList}</div>
                    : view === 1
                    ?
                        <div>{repliesList}</div>
                    : view === 2
                    ?
                        <div>{likesList}</div>
                    : view === 3
                    ?
                        <div>{dislikesList}</div>
                    :
                        <div>{savesList}</div>
                }
            </Container>
        )
    } else {
        return (
            <h1 className="mt-3">Login to View</h1>
        )
    }
}