import React, { SyntheticEvent } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { postNewPost } from "../reducers/postsSlice";


export const NewPostForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userStatus = useAppSelector(state => state.user)

    // called when attempting to create a new post
    const postForm = (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            title: {value: string};
            body: {value: string};
            categories: {value: string};
        };
        if (userStatus.isAuthenticated) {
            dispatch(postNewPost(
                target.title.value, 
                target.body.value,
                target.categories.value, 
                userStatus.id!
            ));
            navigate(-1)
        } else {
            alert("You are not logged in, login before trying again");
        }
    }

    // callled when cancel is clicked, navigates to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <Container className="col-8">
            <h1 className="white-text">Start a new Thread</h1>
            <Form onSubmit={postForm}>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label className="float-start white-text">Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="body">
                    <Form.Label className="float-start white-text">Body Text</Form.Label>
                    <Form.Control as="textarea" rows={10} placeholder="Text"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="categories">
                    <Form.Label className="float-start white-text">Categories</Form.Label>
                    <Form.Control type="text" placeholder="categories"/>
                    <Form.Text className="float-start white-text">Enter categories separated with a space</Form.Text>
                </Form.Group>
                <Button variant="secondary" className="float-end" onClick={handleCancel}>
                    <FontAwesomeIcon icon={solid('ban')}/> Cancel
                </Button>
                <Button variant="primary" className="float-end me-2" type="submit">
                    <FontAwesomeIcon icon={solid('plus')}/> Post
                </Button> 
            </Form>
        </Container>
    )
}