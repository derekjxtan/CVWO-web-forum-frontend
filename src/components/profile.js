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

    const [posts, setPosts] = useState(true);

    useEffect(() => {
        dispatch(fetchProfile(parseInt(params.userId)));
    }, [])

    const displayPosts = () => {
        if (!posts) {
            setPosts(true);
        }
    }

    const displayReplies = () => {
        if (posts) {
            setPosts(false);
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

    var postsList = (<div/>);
    var repliesList = (<div/>);
    
    if (profile) {
        postsList = profile.posts.map(post => (
            <Card className="mt-3" key={post.id}>
                <Card.Header>
                    <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Card.Subtitle>{post.created_at}</Card.Subtitle>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
                        </Col>
                    </Row>
                    <Card.Subtitle className="d-flex justify-content-start mt-1">Tags: Fun, Games</Card.Subtitle>
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

        repliesList = profile.replies.map(reply => (
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
                <Button variant="primary" active={posts} onClick={displayPosts}>Posts</Button>
                <Button variant="primary" active={!posts} className="ms-2" onClick={displayReplies}>Replies</Button>
                {
                    posts
                    ?
                        <div>{postsList}</div>
                    :
                        <div>{repliesList}</div>
                }
            </Container>
        )
    } else {
        return (
            <h1 className="mt-3">Login to View</h1>
        )
    }
}