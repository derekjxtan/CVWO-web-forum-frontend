import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { Link } from "react-router-dom";

import Card  from "react-bootstrap/Card";
import Col  from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";

import { likePost, unlikePost, dislikePost, undislikePost, savePost, unsavePost, deletePost } from "../reducers/postsSlice";

import { PostInterface } from "../app/interfaces";


interface SinglePostProps {
    post: PostInterface;
    handleLike(id: number, like: boolean): void;
    handleDislike(id: number, dislike: boolean): void;
    handleSave(id: number, save: boolean): void;
    handleDelete(id: number): void;
}

const SinglePost = (props: SinglePostProps) => {
    const post = props.post;
    const userStatus = useAppSelector(state => state.user);

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [save, setSave] = useState(false);

    const [likes, setLikes] = useState(post.likes);
    const [dislikes, setDislikes] = useState(post.dislikes);

    useEffect(() => {
        // whether post has been liked, disliked or saved
        if (userStatus.isAuthenticated) {
            setLike(userStatus.liked.find(item => item.id === post.id) === undefined);
            setDislike(userStatus.disliked.find(item => item.id === post.id) === undefined);
            setSave(userStatus.saved.find(item => item.id === post.id) === undefined);
        }
    }, [userStatus, post.id])

    // called when like is clicked
    // passes required parameters to handleLike declared in Posts component and make changes to the state locally
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

    // called when dislike is clicked
    // passes required parameters to handleDislike declared in Posts component and make changes to the state locally
    const handleDislike = () => {
        props.handleDislike(props.post.id, dislike);
        if (dislike && !like) {
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

    // called when save is clicked
    // passes required parameters to handleSave declared in Posts component and make changes to the state locally
    const handleSave = () => {
        props.handleSave(props.post.id, save);
        setSave(!save);
    }

    // called when liked is clicked
    // passes required parameters to handleDelete declared in Posts component
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
                            userStatus.isAuthenticated && userStatus.id === post.user!.id
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
                        @<Link to={`/users/${post.user!.id}`}>{post.user!.username}</Link>, {date.toLocaleTimeString() + ", " + date.toLocaleDateString()}
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


interface PostsProps {
    posts: Array<PostInterface>;
}

export const Posts = (props: PostsProps) => {
    const dispatch = useAppDispatch();

    const posts = props.posts;
    const userStatus = useAppSelector(state => state.user);

    // checks whether post has already been liked by user. If so call likePost, otherwise call unlikePost
    const handleLike = (post_id: number, like: boolean) => {
        if (like) {
            dispatch(likePost(userStatus.id!, post_id, userStatus.liked, userStatus.disliked));
        } else {
            dispatch(unlikePost(userStatus.id!, post_id, userStatus.liked));
        }
    }

    // checks whether post has already been disliked by user. If so call dislikePost, otherwise call undislikePost
    const handleDislike = (post_id: number, dislike: boolean) => {
        if (dislike) {
            dispatch(dislikePost(userStatus.id!, post_id, userStatus.disliked, userStatus.liked));
        } else {
            dispatch(undislikePost(userStatus.id!, post_id, userStatus.disliked));
        }
    }

    // checks whether post has already been saved by user. If so call savePost, otherwise call unsavePost
    const handleSave = (post_id: number, save: boolean) => {
        if (save) {
            dispatch(savePost(userStatus.id!, post_id, userStatus.saved));
        } else {
            dispatch(unsavePost(userStatus.id!, post_id, userStatus.saved));
        }
    }

    // called when attempting to delete a post
    // dispatches deletePost function from postsSlice
    const handleDelete = (post_id: number) => {
        alert("Deleting post " + post_id);
        dispatch(deletePost(post_id));
    }

    const postsList = posts.map((post: PostInterface) => 
        <SinglePost post={post} 
            handleLike={handleLike} 
            handleDislike={handleDislike} 
            handleSave={handleSave}
            handleDelete={handleDelete}
            key={post.id}/>
    );

    return (
        <div>
            {postsList}
        </div>
    )
}