import React, { SyntheticEvent, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { editPost, fetchPost } from "../reducers/postsSlice";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";


export const EditPostForm = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const postId =  parseInt(params.postId!);

    useEffect(() => {
        dispatch(fetchPost(postId));
    }, [dispatch, postId])

    const postsStatus = useAppSelector(state => state.posts);
    const post = postsStatus.posts.find(post => post.id === postId);

    const userStatus = useAppSelector(state => state.user);

    // called when attempting to edit a post
    const handleEdit = (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            title: {value: string};
            body: {value: string};
            categories: {value: string}
        };
        dispatch(editPost(postId, target.title.value, target.body.value, target.categories.value));
        navigate(-1);
    }

    // callled when cancel is clicked, navigates to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    if (postsStatus.isLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (postsStatus.err) {
        return (
            <Error error={postsStatus.err} />
        );
    } else if (userStatus.isAuthenticated && post && userStatus.id === post.user_id) {
        return (
            <Container className="col-8">
                <h1 className="white-text">Edit Thread</h1>
                <Form onSubmit={handleEdit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label className="float-start white-text">Title</Form.Label>
                        <Form.Control type="text" placeholder="Title" defaultValue={post.title} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label className="float-start white-text">Body Text</Form.Label>
                        <Form.Control as="textarea" rows={10} placeholder="Text" defaultValue={post.body}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="categories">
                        <Form.Label className="float-start white-text">Categories</Form.Label>
                        <Form.Control type="text" placeholder="categories" defaultValue={post.categories.reduce((x, y) => x + y + " ", "")}/>
                        <Form.Text className="float-start white-text">Enter categories separated with a space</Form.Text>
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