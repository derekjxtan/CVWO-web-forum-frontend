import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import { editReply } from "../reducers/postsSlice";
import { fetchProfile } from "../reducers/profileSlice";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";


export const EditReplyForm = () => {
    const dispatch = useDispatch()
    const params = useParams();
    const navigate = useNavigate();

    const replyId =  parseInt(params.replyId);
    const userId = parseInt(params.userId)

    useEffect(() => {
        dispatch(fetchProfile(userId));
    }, [dispatch, userId])

    const profile = useSelector(state => state.profile.profile);
    const userStatus = useSelector(state => state.user)

    // called when attempting to edit a post
    const handleEdit = (e, reply) => {
        // console.log(e.target[0].value, e.target[1].value);
        e.preventDefault();
        dispatch(editReply(replyId, e.target[0].value));
        navigate(`/posts/${reply.post_id}`);
    }

    // callled when cancel is clicked, navigates to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    if (userStatus.isAuthenticated && profile && userStatus.user.id === profile.id) {
        const reply = profile.replies.find(reply => reply.id === replyId);
        return (
            <Container className="col-8">
                <h1 className="white-text">Edit Reply</h1>
                <Form onSubmit={(event) => handleEdit(event, reply)}>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label className="float-start white-text">Body Text</Form.Label>
                        <Form.Control as="textarea" rows={10} placeholder="Text" defaultValue={reply.body}/>
                    </Form.Group>
                    <Button variant="secondary" className="float-end" onClick={handleCancel}>
                        <FontAwesomeIcon icon={solid('ban')}/> Cancel
                    </Button>
                    <Button variant="primary" className="float-end me-2" type="submit">
                        <FontAwesomeIcon icon={solid('pen')}/> Edit
                    </Button> 
                </Form>
            </Container>
        )
    } else {
        return (
            <h1>Wrong user, unable to edit post</h1>
        )
    }
}