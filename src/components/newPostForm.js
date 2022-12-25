import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { postNewPost } from "../reducers/postsSlice";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";


export const NewPostForm = () => {
    const dispatch = useDispatch()

    const userStatus = useSelector(state => state.user)

    // called when attempting to create a new post
    const postForm = (e) => {
        // console.log(e);
        // console.log(e.target[0].value, e.target[1].value, userStatus.user.id);
        if (userStatus.isAuthenticated) {
            dispatch(postNewPost(
                e.target[0].value, 
                e.target[1].value,
                e.target[2].value, 
                userStatus.user.id
            ));
        } else {
            alert("You are not logged in, login before trying again");
        }
    }

    return (
        <Container className="col-8">
            <h1>Start a new Thread</h1>
            <Form onSubmit={postForm}>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label className="ms-auto">Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="body">
                    <Form.Label>Body Text</Form.Label>
                    <Form.Control as="textarea" rows={10} placeholder="Text"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="categories">
                    <Form.Label>Categories</Form.Label>
                    <Form.Control type="text" placeholder="categories"/>
                    <Form.Text className="float-start" muted>Enter categories separated with a space</Form.Text>
                </Form.Group>
                <Link to={`/`} className='btn btn-secondary float-end'>Cancel</Link>
                <Button variant="primary" className="float-end me-2" type="submit">
                    Post
                </Button> 
            </Form>
        </Container>
    )
}