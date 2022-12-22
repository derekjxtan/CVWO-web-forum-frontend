import React, { useEffect, useState } from "react";

import { Button, Container, Row, Card, Col } from "react-bootstrap";

import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { deletePost, deleteReply } from "../reducers/postsSlice";
import { fetchUser } from "../reducers/userSlice";


export const Profile = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const userStatus = useSelector(state => state.user)

    const [posts, setPosts] = useState(true);

    useEffect(() => {
        dispatch(fetchUser(parseInt(params.userId)));
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

    if (userStatus.isAuthenticated) {
        postsList = userStatus.user.posts.map(post => (
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
                        {/* <Nav.Link href={'#'+post.id} className="me-2"><Button variant="primary">See full</Button></Nav.Link> */}
                        <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                        <Button variant="danger" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                    </div>
                </Card.Body>
            </Card>
        ));

        repliesList = userStatus.user.replies.map(reply => (
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
                <h3>{userStatus.user.username}</h3>
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