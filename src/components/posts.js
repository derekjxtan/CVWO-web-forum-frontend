import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card  from "react-bootstrap/Card";
import Col  from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

import { likePost, unlikePost, dislikePost, undislikePost, savePost, unsavePost, deletePost } from "../reducers/postsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";

const SinglePost = (props) => {
    const post = props.post;
    const userStatus = useSelector(state => state.user);

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [save, setSave] = useState(false);

    const [likes, setLikes] = useState(post.likes);
    const [dislikes, setDislikes] = useState(post.dislikes);

    useEffect(() => {
        if (userStatus.isAuthenticated) {
            setLike(userStatus.user.liked.find(item => item.id === post.id) === undefined);
            setDislike(userStatus.user.disliked.find(item => item.id === post.id) === undefined);
            setSave(userStatus.user.saved.find(item => item.id === post.id) === undefined);
        }
    }, [userStatus, post.id])

    const handleLike = () => {
        props.handleLike(props.post.id, like);
        if (like && !dislike) {
            setDislikes(dislikes - 1);
            setDislike(true);
        }
        if (like) {
            setLikes(likes + 1);
            setLike(false);
        } else {
            setLikes(likes - 1);
            setLike(true);
        }
    }

    const handleDislike = () => {
        props.handleDislike(props.post.id, dislike);
        if (dislike & !like) {
            setLikes(likes - 1)
            setLike(true);
        } 
        if (dislike) {
            setDislikes(dislikes + 1);
            setDislike(false);
        } else {
            setDislikes(dislikes - 1);
            setDislike(true);
        }
    }

    const handleSave = () => {
        props.handleSave(props.post.id, save);
        setSave(!save);
    }

    const handleDelete = () => {
        props.handleDelete(props.post.id);
    }

    const date = new Date(post.created_at);

    return (
        <Card className="mt-3">
            <Card.Header>
                <Row>
                    <Col className="d-flex justify-content-start">
                        <Card.Title>{post.title}</Card.Title>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {
                            userStatus.isAuthenticated && userStatus.user.id === post.user.id
                            ?
                                <div>
                                    <Link to={`/posts/${post.id}/edit`} className='btn btn-outline-dark button-plain'>
                                        <FontAwesomeIcon icon={solid('pen')} />
                                    </Link>
                                    <Button variant='outline-dark' className="button-plain" onClick={handleDelete}>
                                        <FontAwesomeIcon icon={solid('trash')}/>
                                    </Button>
                                    <Link to={`/posts/${post.id}`} className='btn btn-outline-dark button-plain'>
                                        <FontAwesomeIcon icon={solid('up-right-and-down-left-from-center')}/>
                                    </Link>
                                </div>
                            : 
                                <Link to={`/posts/${post.id}`} className='btn btn-outline-dark button-plain'>
                                    <FontAwesomeIcon icon={solid('up-right-and-down-left-from-center')}/>
                                </Link>
                        }
                    </Col>
                </Row>
                    <Card.Subtitle className="d-flex justify-content-start">
                        @<Link to={`/users/${post.user.id}`}>{post.user.username}</Link>, {date.toLocaleTimeString() + ", " + date.toLocaleDateString()}
                    </Card.Subtitle>
                <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {post.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>{post.body.substring(0, 100)}</Card.Text>
            </Card.Body>
            <Card.Footer>
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
            </Card.Footer>
        </Card>
    )
}

export const Posts = (props) => {
    const dispatch = useDispatch();

    const [order, setOrder] = useState(0);

    const posts = props.posts;
    const userStatus = useSelector(state => state.user);

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
    const handleLike = (post_id, like) => {
        if (like) {
            dispatch(likePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(unlikePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

    // checks whether post has already been disliked by user. If so call dislikePost, otherwise call undislikePost
    const handleDislike = (post_id, dislike) => {
        if (dislike) {
            dispatch(dislikePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(undislikePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

    // checks whether post has already been saved by user. If so call savePost, otherwise call unsavePost
    const handleSave = (post_id, save) => {
        if (save) {
            dispatch(savePost(userStatus.user.id, post_id, userStatus.user));
        } else {
            dispatch(unsavePost(userStatus.user.id, post_id, userStatus.user));
        }
    }

    // called when attempting to delete a post
    // dispatches deletePost function from postsSlice
    const handleDelete = (post_id) => {
        alert("Deleting post " + post_id);
        dispatch(deletePost(post_id));
    }

    const postsList = sortPosts().map(post => 
        <SinglePost post={post} 
            handleLike={handleLike} 
            handleDislike={handleDislike} 
            handleSave={handleSave}
            handleDelete={handleDelete}
            key={post.id}/>
    );

    return (
        <Container className="col-8 mt-3">
            <Row>
                <Container>
                    <Button variant="primary" className="float-end" onClick={sortEarliest} active={order === 1}>Earliest</Button>
                    <Button variant="primary" className="float-end me-1" onClick={sortLatest} active={order === 0}>Latest</Button>
                </Container>
            </Row>
            <Container>
                {postsList}
            </Container>
        </Container>
    )
}