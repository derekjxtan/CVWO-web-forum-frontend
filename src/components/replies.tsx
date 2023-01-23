import { SyntheticEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro";

import { updateProfileReplies } from '../reducers/profileSlice';

import { ReplyInterface } from '../app/interfaces';
import Cookies from 'js-cookie';
import { baseUrl } from '../reducers/baseUrl';
import { dislikeReply, likeReply, undislikeReply, unlikeReply } from '../reducers/postSlice';

interface SingleReplyProps {
    reply: ReplyInterface;
    handleDelete(reply_id: number): void;
}

const SingleReply = (props: SingleReplyProps) => {
    const dispatch = useAppDispatch();

    const userStatus = useAppSelector(state => state.user);
    const reply = props.reply;

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    const [likes, setLikes] = useState(reply.likes);
    const [dislikes, setDislikes] = useState(reply.dislikes);

    const date = new Date(reply.created_at);

    useEffect(() => {
        if (userStatus.isAuthenticated) {
            setLike(userStatus.liked_r.find(item => item.id === reply.id) === undefined);
            setDislike(userStatus.disliked_r.find(item => item.id === reply.id) === undefined);
        }
    }, [userStatus, reply])

    const handleDelete = () => {
        props.handleDelete(reply.id);
    }

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

    return (
        <Card className="mt-3" key={reply.id}>
            <Card.Header>
                <Row>
                    <Col md={6} xs={12}>
                        <Card.Subtitle className="d-flex justify-content-start">{date.toLocaleTimeString() + ", " + date.toLocaleDateString()}</Card.Subtitle>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                        {
                            userStatus.isAuthenticated && userStatus.id === reply.user!.id
                            ?
                                <div>
                                    <Link to={`./replies/${reply.id}/edit`} className='btn btn-outline-dark button-plain'>
                                        <FontAwesomeIcon icon={solid('pen')} />
                                    </Link>
                                    <Button variant='outline-dark' className="button-plain" onClick={handleDelete}>
                                        <FontAwesomeIcon icon={solid('trash')}/>
                                    </Button>
                                    <Link to={`/posts/${reply.post_id}`} className='btn btn-outline-dark button-plain'>
                                        <FontAwesomeIcon icon={solid('up-right-and-down-left-from-center')}/>
                                    </Link>
                                </div>
                            : 
                                <Link to={`/posts/${reply.post_id}`} className='btn btn-outline-dark button-plain'>
                                    <FontAwesomeIcon icon={solid('up-right-and-down-left-from-center')}/>
                                </Link>
                        }
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Card.Text>{reply.body}</Card.Text>
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
            </Card.Footer>
        </Card>
    )
}

interface Props {
    replies: Array<ReplyInterface>
}

export const Replies = (props: Props) => {
    const dispatch = useAppDispatch();

    const replies = props.replies;

    // called when attempting to delete a reply
    // dispatches deleteReply function from postsSlice
    const handleDelete = (reply_id: number) => {
        alert("Deleting reply " + reply_id);
        const token = 'Bearer ' + Cookies.get('token');
        fetch(baseUrl + 'replies/' + reply_id.toString(), {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            // console.log(response);
            if (response.ok) {
                alert("Reply sucessfully deleted");
                dispatch(updateProfileReplies(replies.filter(reply => reply.id !== reply_id)))
                return response
            } else {
                if (response.status === 404) {
                    alert("Reply does not exist");
                } else {
                    alert("Error deleting post");
                }
                var err = new Error('Error' + response.status + ": " + response.statusText);
                err.message = response.statusText;
                throw err;
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
    }

    const repliesList = replies.map(reply => (<SingleReply reply={reply} handleDelete={handleDelete} key={reply.id}/>));

    return (
        <Container>
            {repliesList}
        </Container>
    )
}