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

import { likePost, unlikePost, dislikePost, undislikePost, savePost, unsavePost } from "../reducers/postsSlice";
import { deleteReply, dislikeReply, fetchPost, fetchPostReplies, fetchSubReplies, likeReply, postNewReply, undislikeReply, unlikeReply } from "../reducers/postSlice";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";

import { ReplyInterface, UserInterface } from "../app/interfaces";


interface ReplyProps {
    reply: ReplyInterface;
    post_id: number;
    depth: number;
    reply_order: number;
    parent_user: string | undefined;
}

const Reply = (props: ReplyProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userStatus = useAppSelector(state => state.user);
    const reply = props.reply

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    const [likes, setLikes] = useState(reply.likes);
    const [dislikes, setDislikes] = useState(reply.dislikes);

    const [toReply, setToReply] = useState(false);
    const [seeReplies, setSeeReplies] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(false);


    useEffect(() => {
        if (userStatus.isAuthenticated) {
            setLike(userStatus.liked_r.find(item => item.id === reply.id) === undefined);
            setDislike(userStatus.disliked_r.find(item => item.id === reply.id) === undefined);
        }
    }, [userStatus, reply])

    // If currently disliked, undislike locally
    // If currently unliked, like locally and send request to backend
    // If currently liked, unlike locally and send request to backend
    const handleLike = (e: SyntheticEvent) => {
        e.preventDefault();
        if (like && !dislike) {
            setDislikes(dislikes - 1);
            setDislike(true);
        }
        if (like) {
            setLikes(likes + 1);
            setLike(false);
            dispatch(likeReply(reply.id, userStatus.liked_r, userStatus.disliked_r));
        } else {
            setLikes(likes - 1);
            setLike(true);
            dispatch(unlikeReply(reply.id, userStatus.liked_r))
        }
    }

    // If currently liked, unlike locally
    // If currently undisliked, dislike locally and send request to backend
    // If currently disliked, undislike locally and send request to backend
    const handleDislike = (e: SyntheticEvent) => {
        e.preventDefault();
        if (dislike && !like) {
            setLikes(likes - 1);
            setLike(true);
        }
        if (dislike) {
            setDislikes(dislikes + 1);
            setDislike(false);
            dispatch(dislikeReply(reply.id, userStatus.disliked_r, userStatus.liked_r));
        } else {
            setDislikes(dislikes - 1);
            setDislike(true);
            dispatch(undislikeReply(reply.id, userStatus.disliked_r));
        }
    }

    // calls deleteReply
    const handleDelete = () => {
        dispatch(deleteReply(reply.id));
        navigate(0);
    }

    // opens form to reply to current reply
    const toggleToReply = () => {
        setToReply(!toReply);
    }

    // handle submission of reply form
    const postForm = (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            body: {value: string};
        };
        if (userStatus.isAuthenticated) {
            if (repliesLoaded) {
                dispatch(postNewReply(
                    target.body.value,
                    userStatus.id!,
                    props.post_id,
                    reply.id,
                    true
                ));
            } else {
                dispatch(postNewReply(
                    target.body.value,
                    userStatus.id!,
                    props.post_id,
                    reply.id,
                    false
                ));
                getSubReplies();
            }
            toggleToReply();
        } else {
            alert("You are not logged in, login before trying again");
        }
    }

    // call fetchSubReplies in postSlice
    const getSubReplies = () => {
        if (seeReplies === false) {
            setSeeReplies(true);
            if (!repliesLoaded) {
                dispatch(fetchSubReplies(reply.id, props.reply_order));
                setRepliesLoaded(true);
            }
        } else {
            setSeeReplies(false);
        }
    }

    const replyDate = new Date(reply.created_at);

    const subReplies = useAppSelector(state => state.post).replies
        .filter(r => r.reply_id === reply.id)
        .map(reply => <Reply reply={reply} post_id={props.post_id} reply_order={props.reply_order} depth={props.depth + 1} parent_user={reply.user?.username} key={reply.id}/>)

    const toParent = (
        <div>
            <FontAwesomeIcon icon={solid('reply')} size="sm"/>&nbsp;
            {props.parent_user}
        </div>
    )
    
    const header = (
        <Card.Header className="rosy-brown-bg">
            <Row>
                <Col lg={7} xs={12}>
                    <Row>
                        <Card.Subtitle className="d-flex justify-content-start">
                            @<Link to={`/users/${reply.user!.id}`}>{reply.user!.username}</Link>&nbsp;
                            {
                                props.depth > 3
                                ? 
                                    toParent
                                :
                                    <div />
                            }
                        </Card.Subtitle>
                    </Row>
                    <Row className="mt-1">
                        <Card.Subtitle className="d-flex justify-content-start">
                            {replyDate.toLocaleTimeString() + ", " + replyDate.toLocaleDateString()}
                        </Card.Subtitle>
                    </Row>
                </Col>
                <Col lg={5} xs={12} className="d-flex justify-content-end">
                    {
                        (userStatus.isAuthenticated && userStatus.id === reply.user!.id)
                        ?
                            <div>
                                <Link to={`/users/${userStatus.id}/replies/${reply.id}/edit`} className='btn btn-outline-dark button-plain'>
                                    <FontAwesomeIcon icon={solid('pen')} size="sm"/>
                                </Link>
                                <Button variant='outline-dark' className="button-plain" onClick={handleDelete}>
                                    <FontAwesomeIcon icon={solid('trash')} size="sm"/>
                                </Button>
                            </div>
                        :
                            <div></div>
                    }
                </Col>
            </Row>
        </Card.Header>
    )

    const body = (
        <Card.Body className="light-grey-bg">
            <Card.Text className="d-flex justify-content-start">{reply.body}</Card.Text>
            {
                    userStatus.isAuthenticated
                    ?
                        <div className="d-flex justify-content-end">
                            {
                                reply.replies_count !== 0
                                ?
                                    <Button variant="outline-secondary" className="button-plain" onClick={getSubReplies}>See replies</Button>
                                :
                                    <div />
                            }
                            <Button variant="outline-secondary" className="button-plain" onClick={toggleToReply}>Reply</Button>
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
                        </div>
                    : 
                        <div className="d-flex justify-content-end">
                            <Button variant='outline-success' className="button-plain">
                                <FontAwesomeIcon icon={regular('thumbs-up')} size='lg'/>
                                &nbsp;{likes}
                            </Button>
                            <Button variant='outline-danger' className=" button-plain">
                                <FontAwesomeIcon icon={regular('thumbs-down')} size='lg'/>
                                &nbsp;{dislikes}
                            </Button>
                            <Button variant='outline-secondary' className="button-plain" >
                                <FontAwesomeIcon icon={regular('bookmark')} size='lg'/>
                            </Button>
                        </div>
                }
                {
                    toReply
                    ?
                        <div>
                            <Form onSubmit={postForm}>
                                <Form.Group className="mb-3" controlId="formReply">
                                    <Row>
                                        <Form.Group className="mb-3" controlId="body">
                                            <Form.Control as="textarea" placeholder="Reply to the post" rows={3} required/>
                                        </Form.Group>
                                        <div className="d-flex justify-content-end">
                                            <Button type="submit" className="mt-2">
                                                <FontAwesomeIcon icon={solid('reply')}/> Reply
                                            </Button>
                                        </div>
                                    </Row>
                                </Form.Group>
                            </Form>
                        </div>
                    :
                        <div/>
                }
        </Card.Body>
    )

    if (props.depth >= 3) {
        return (
            <div>
                <Card className="mt-3">
                    {header}
                    {body}
                </Card>
                {subReplies}
            </div>
        )
    } else {
        return (
            <Card className="mt-3">
                {header}
                {body}
                <Card.Footer>
                    <Col lg={11} className="float-end">
                        {
                        seeReplies
                        ?
                            subReplies
                        :
                            <div/>
                        }
                    </Col>
                </Card.Footer>
            </Card>
        );
    }
}


interface PostCardProps {
    isRepliesLoading: boolean;
    errReplies: string;
    id: number;
    title: string;
    body: string;
    categories: Array<string>
    likes: number;
    dislikes: number;
    saves: number;
    replies: Array<ReplyInterface>;
    user_id: number;
    user: UserInterface
    created_at: string;
    updated_at: string;
}

const PostCard = (props: PostCardProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    
    const postId = props.id;
    const date = new Date(props.created_at);
    const replies = props.replies

    const userStatus = useAppSelector(state => state.user);

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [save, setSave] = useState(false);

    const [likes, setLikes] = useState(props.likes);
    const [dislikes, setDislikes] = useState(props.dislikes);

    const [order, setOrder] = useState(0);

    useEffect(() => {
        // check whether post has been liked, disliked or saved
        if (userStatus.isAuthenticated) {
            setLike(userStatus.liked.find(item => item.id === props.id) === undefined);
            setDislike(userStatus.disliked.find(item => item.id === props.id) === undefined);
            setSave(userStatus.saved.find(item => item.id === props.id) === undefined);
        }
    }, [userStatus, props]);

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

    const getNewestReplies = () => {
        setOrder(0);
        dispatch(fetchPostReplies(postId, 0));
    }

    const getOldestReplies = () => {
        setOrder(1);
        dispatch(fetchPostReplies(postId, 1));
    }

    const getMostLikesReplies = () => {
        setOrder(2);
        dispatch(fetchPostReplies(postId, 2));
    }

    const getMostDislikesReplies = () => {
        setOrder(3);
        dispatch(fetchPostReplies(postId, 3));
    }

    const repliesList = replies!
        .filter(reply => reply.reply_id === null)
        .map(reply => <Reply reply={reply} post_id={postId} reply_order={order} depth={0} parent_user={undefined} key={reply.id}/>);
    
    return (
        <Container className="col-8 mt-3">
            <Card className="mt-3">
            <Card.Header>
            <Row>
                <Col className="d-flex justify-content-start">
                    <Card.Title>{props.title}</Card.Title>
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
                                    &nbsp;{likes}
                                </Button>
                                <Button variant='outline-danger' className=" button-plain">
                                    <FontAwesomeIcon icon={regular('thumbs-down')} size='lg'/>
                                    &nbsp;{dislikes}
                                </Button>
                                <Button variant='outline-secondary' className="button-plain" >
                                    <FontAwesomeIcon icon={regular('bookmark')} size='lg'/>
                                </Button>
                            </div>
                    }
                </Col>
            </Row>
                <Card.Subtitle className="d-flex justify-content-start">
                    @<Link to={`/users/${props.user!.id}`}>{props.user!.username}</Link>, {date.toLocaleTimeString() + ", " + date.toLocaleDateString()}
                </Card.Subtitle>
            <Card.Subtitle className="d-flex justify-content-start mt-1">Categories: {props.categories.reduce((x, y) => x + y + ", ", "").slice(0,-2)}</Card.Subtitle>
        </Card.Header>
                <Card.Body>
                    <Card.Text>{props.body}</Card.Text>
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
                    <Container className="box">
                        <Row>
                            <Container>
                                <Button variant="primary" className="float-end" onClick={getNewestReplies} active={order === 0}>Newest</Button>
                                <Button variant="primary" className="float-end me-1" onClick={getOldestReplies} active={order === 1}>Oldest</Button>
                                <Button variant="primary" className="float-end me-1" onClick={getMostLikesReplies} active={order === 2}>Most Liked</Button>
                                <Button variant="primary" className="float-end me-1" onClick={getMostDislikesReplies} active={order === 3}>Most Disliked</Button>
                            </Container>
                        </Row>
                    </Container>
                    {
                        props.isRepliesLoading
                        ?
                            <LoadingSpinner />
                        : props.errReplies
                        ?
                            <Error error={props.errReplies} />
                        :
                            repliesList
                    }
                </Card.Footer>
            </Card>
        </Container>
    );
}


export const Post = () => {
    const params = useParams()
    const dispatch = useAppDispatch()
    
    const postId = parseInt(params.postId!)

    const postStatus = useAppSelector(state => state.post);

    useEffect(() => {
        dispatch(fetchPost(postId));
    }, [dispatch, postId]);

    if (postStatus.isPostLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (postStatus.errPost) {
        return (
            <Error error={postStatus.errPost} />
        );
    } else {
        return (
            <PostCard 
                isRepliesLoading={postStatus.isRepliesLoading}
                errReplies={postStatus.errReplies!}
                id={postStatus.id!}
                title={postStatus.title!}
                body={postStatus.body!}
                categories={postStatus.categories!}
                likes={postStatus.likes!}
                dislikes={postStatus.dislikes!}
                saves={postStatus.saves!}
                replies={postStatus.replies!}
                user_id={postStatus.user_id!}
                user={postStatus.user!}
                created_at={postStatus.created_at!}
                updated_at={postStatus.updated_at!}
            />
        );
    }  
};