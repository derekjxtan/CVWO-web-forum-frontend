import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import { editPost, fetchPost } from "../reducers/postsSlice";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


export const EditPostForm = () => {
    const dispatch = useDispatch()
    const params = useParams();

    const postId =  parseInt(params.postId);

    useEffect(() => {
        dispatch(fetchPost(postId));
    }, [])

    const post = useSelector(state => state.posts.posts.find(post => post.id === postId))
    const userStatus = useSelector(state => state.user)

    // called when attempting to edit a post
    const handleEdit = (e) => {
        // console.log(e.target[0].value, e.target[1].value);
        dispatch(editPost(postId, e.target[0].value, e.target[1].value));
        e.preventDefault();
    }

    if (userStatus.isAuthenticated && post && userStatus.user.id === post.user_id) {
        return (
            <Container className="col-8">
                <h1>Edit Thread</h1>
                <Form onSubmit={handleEdit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label className="ms-auto">Title</Form.Label>
                        <Form.Control type="text" placeholder="Title" defaultValue={post.title} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body Text</Form.Label>
                        <Form.Control as="textarea" rows={10} placeholder="Text" defaultValue={post.body}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="categories">
                        <Form.Label>Categories</Form.Label>
                        <Form.Control type="text" placeholder="categories"/>
                    </Form.Group>
                    <Link to={`/posts/${postId}`} className='btn btn-secondary float-end'>Cancel</Link>
                    <Button variant="primary" className="float-end me-2" type="submit">
                        Edit
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