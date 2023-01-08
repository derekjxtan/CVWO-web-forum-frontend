import React, { SyntheticEvent, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { editReply } from "../reducers/postsSlice";
import { fetchProfile } from "../reducers/profileSlice";

import { ReplyInterface } from "../app/interfaces";


export const EditReplyForm = () => {
    const dispatch = useAppDispatch()
    const params = useParams();
    const navigate = useNavigate();

    const replyId =  parseInt(params.replyId!);
    const userId = parseInt(params.userId!);

    useEffect(() => {
        dispatch(fetchProfile(userId));
    }, [dispatch, userId])

    const profile = useAppSelector(state => state.profile.profile);
    const userStatus = useAppSelector(state => state.user)

    // called when attempting to edit a post
    const handleEdit = (e: SyntheticEvent, reply: ReplyInterface) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            body: {value: string};
        };
        dispatch(editReply(replyId, target.body.value));
        navigate(`/posts/${reply.post_id}`);
    }

    // callled when cancel is clicked, navigates to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    if (userStatus.isAuthenticated && profile && userStatus.id === profile.id) {
        const reply = profile.replies!.find(reply => reply.id === replyId);
        return (
            <Container className="col-8">
                <h1 className="white-text">Edit Reply</h1>
                <Form onSubmit={(event) => handleEdit(event, reply!)}>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label className="float-start white-text">Body Text</Form.Label>
                        <Form.Control as="textarea" rows={10} placeholder="Text" defaultValue={reply!.body}/>
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