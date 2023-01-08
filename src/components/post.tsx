import React, { SyntheticEvent, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";

import { fetchPost, postNewReply, likePost, unlikePost, dislikePost, undislikePost, savePost, unsavePost } from "../reducers/postsSlice";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";

import { PostInterface } from "../app/interfaces";


type Props = {
    post: PostInterface
}

const PostCard = (props: Props) => {
    const params = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    
    const post = props.post;
    const postId = post.id;
    const date = new Date(post.created_at);
    const replies = post.replies

    const userStatus = useAppSelector(state => state.user);

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [save, setSave] = useState(false);

    const [likes, setLikes] = useState(post.likes);
    const [dislikes, setDislikes] = useState(post.dislikes);

    useEffect(() => {
        // check whether post has been liked, disliked or saved
        if (userStatus.isAuthenticated && post) {
            setLike(userStatus.liked.find(item => item.id === post.id) === undefined);
            setDislike(userStatus.disliked.find(item => item.id === post.id) === undefined);
            setSave(userStatus.saved.find(item => item.id === post.id) === undefined);
        }
    }, [userStatus, post, params]);

    // checks whether post has already been liked by user. If so call likePost, otherwise call unlikePost
    const handleLike = () => {
        if (like && !dislike) {
            setDislikes(dislikes - 1);
            setDislike(true);
        }
        if (like) {
            setLikes(likes + 1);
            setLike(false);
            dispatch(likePost(userStatus.id!, postId, userStatus.liked, userStatus.disliked));
        } else {
            setLikes(likes - 1);
            setLike(true);
            dispatch(unlikePost(userStatus.id!, postId, userStatus.liked));
        }
    }

    // checks whether post has already been disliked by user. If so call dislikePost, otherwise call undislikePost
    const handleDislike = () => {
        if (dislike && !like) {
            setLikes(likes - 1);
            setLike(true);
        }
        if (dislike) {
            setDislikes(dislikes + 1);
            setDislike(false);
            dispatch(dislikePost(userStatus.id!, postId, userStatus.disliked, userStatus.liked));
        } else {
            setDislikes(dislikes - 1);
            setDislike(true);
            dispatch(undislikePost(userStatus.id!, postId, userStatus.disliked));
        }
    }

    // checks whether post has already been saved by user. If so call savePost, otherwise call unsavePost
    const handleSave = () => {
        if (save) {
            dispatch(savePost(userStatus.id!, postId, userStatus.saved));
            setSave(false);
        } else {
            dispatch(unsavePost(userStatus.id!, postId, userStatus.saved));
            setSave(true);
        }
    }

    // called when attempting to post a new reply
    const postForm = (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            body: {value: string};
        };
        if (userStatus.isAuthenticated) {
            dispatch(postNewReply(
                target.body.value,
                userStatus.id!,
                postId
            ));
            navigate(0);
        } else {
            alert("You are not logged in, login before trying again");
            navigate(0);
        }
    }

    const repliesList = replies!.map(reply => {
        const replyDate = new Date(reply.created_at);
        return (
            <Container className="box" key={reply.id}>
                <Card.Text className="d-flex justify-content-start">{reply.body}</Card.Text>
                <Card.Text className="d-flex justify-content-end">
                    @<Link to={`/users/${reply.user!.id}`}>{reply.user!.username}</Link>, {replyDate.toLocaleTimeString() + ", " + replyDate.toLocaleDateString()}
                </Card.Text>
            </Container>
        );
    }).reverse();
    
    return (
        <Container className="col-8 mt-3">
            <Card className="mt-3">
            <Card.Header>
            <Row>
                <Col className="d-flex justify-content-start">
                    <Card.Title>{post.title}</Card.Title>
                </Col>
                <Col className="d-flex justify-content-end">
                    {
                        userStatus.isAuthenticated
                        ?
                            <div className="d-flex justify-content-end">
                                <Button variant='outline-success' className="button-plain" onClick={handleLike}>
                                    {
                                        like
                                        ? <FontAwesomeIcon icon={regular('thumbs-up')} size='lg'/>
                                        : <FontAwesomeIcon icon={solid('thumbs-up')} size='lg'/>
                                    }
                                    &nbsp;{likes}
                                </Button>
                                <Button variant='outline-danger' className="button-plain" onClick={handleDislike}>
                                    {
                                        dislike
                                        ? <FontAwesomeIcon icon={regular('thumbs-down')} size='lg'/>
                                        : <FontAwesomeIcon icon={solid('thumbs-down')} size='lg'/>
                                    }
                                    &nbsp; {dislikes}
                                </Button>
                                <Button variant='outline-secondary' className="button-plain" onClick={handleSave}>
                                    {
                                        save
                                        ? <FontAwesomeIcon icon={regular('bookmark')} size='lg'/>
                                        : <FontAwesomeIcon icon={solid('bookmark')} size='lg'/>
                                    }
                                </Button>
                            </div>
                        : 
                            <div className="d-flex justify-content-end">
                                <Button variant='outline-success' className="button-plain">
                                    <FontAwesomeIcon icon={regular('thumbs-up')} size='lg'/>
                                    &nbsp;{post.likes}
                                </Button>
                                <Button variant='outline-danger' className=" button-plain">
                                    <FontAwesomeIcon icon={regular('thumbs-down')} size='lg'/>
                                    &nbsp;{post.dislikes}
                                </Button>
                                <Button variant='outline-secondary' className="button-plain" >
                                    <FontAwesomeIcon icon={regular('bookmark')} size='lg'/>
                                </Button>
                            </div>
                    }
                </Col>
            </Row>
                <Card.Subtitle className="d-flex justify-content-start">
                    @<Link to={`/users/${post.user!.id}`}>{post.user!.username}</Link>, {date.toLocaleTimeString() + ", " + date.toLocaleDateString()}
                </Card.Subtitle>
            <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
        </Card.Header>
                <Card.Body>
                    <Card.Text>{post.body}</Card.Text>
                </Card.Body>
                <Card.Footer>
                <Container className="box">
                        <Form onSubmit={postForm}>
                            <Form.Group className="mb-3" controlId="formReply">
                                <Row>
                                    <Form.Group className="mb-3" controlId="body">
                                        <Form.Control as="textarea" placeholder="Reply to the post" rows={5} required/>
                                    </Form.Group>
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" className="mt-2">
                                            <FontAwesomeIcon icon={solid('reply')}/> Reply
                                        </Button>
                                    </div>
                                </Row>
                            </Form.Group>
                        </Form>
                    </Container>
                    {repliesList}
                </Card.Footer>
            </Card>
        </Container>
    );
}


export const Post = () => {
    const params = useParams()
    const dispatch = useAppDispatch()
    
    const postId = parseInt(params.postId!)

    const postsStatus = useAppSelector(state => state.posts);
    const post = postsStatus.posts.find(post => post.id === postId);

    useEffect(() => {
        dispatch(fetchPost(postId));
    }, [dispatch, postId]);

    if (postsStatus.isLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (postsStatus.err) {
        return (
            <Error error={postsStatus.err} />
        );
    } else if (post === undefined) {
        return (
            <h1 className="mt-3">Post does not exist</h1>
        )
    } else {
        return (
            <PostCard post={post} />
        );
    }  
};