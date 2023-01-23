import React, { SyntheticEvent, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import { fetchPost } from "../reducers/postSlice";

import { LoadingSpinner } from "./loading";
import { Error } from "./error";
import Cookies from "js-cookie";
import { baseUrl } from "../reducers/baseUrl";


export const EditPostForm = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const navigate = useNavigate();

    const postId =  parseInt(params.postId!);

    useEffect(() => {
        dispatch(fetchPost(postId));
    }, [dispatch, postId])

    const postStatus = useAppSelector(state => state.post);
    const userStatus = useAppSelector(state => state.user);

    // called when attempting to edit a post
    const handleEdit = (e: SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            title: {value: string};
            body: {value: string};
            categories: {value: string}
        };
        // dispatch(editPost(postId, target.title.value, target.body.value, target.categories.value));
        // navigate(-1);
        // format categories, split string into array, remove blanks then remove whitespaces for individual entries
        var categories = target.categories.value.trim();
        if (categories[categories.length - 1] === ',') {
            categories = categories.slice(0, -1);
        }
        var categoriesList = categories.split(" ");
        categoriesList = categoriesList.map(x => x.trim());
        categoriesList = categoriesList.filter(x => x !== '');
        // console.log(categories);
        const token = 'Bearer ' + Cookies.get('token');
        const edits = {
            title: target.title.value,
            body: target.body.value,
            categories: categoriesList
        }
        fetch(baseUrl + 'posts/' + postId.toString(), {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edits),
            credentials: 'same-origin'
        })
        .then(response => {
            // console.log(response);
            if (response.ok) {
                return response
            } else {
                if (response.status === 404) {
                    alert("Post does not exist");
                } else {
                    alert("Error editing post")
                }
            }
        })
        .then(response => response!.json())
        .then(response => {
            // console.log(response);
            alert("Post edited");
            navigate(-1);
            return response;
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
    }

    // callled when cancel is clicked, navigates to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    if (postStatus.isPostLoading) {
        return (
            <LoadingSpinner />
        );
    } else if (postStatus.errPost) {
        return (
            <Error error={postStatus.errPost} />
        );
    } else if (userStatus.isAuthenticated && userStatus.id === postStatus.user_id) {
        return (
            <Container className="col-8">
                <h1 className="white-text">Edit Thread</h1>
                <Form onSubmit={handleEdit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label className="float-start white-text">Title</Form.Label>
                        <Form.Control type="text" placeholder="Title" defaultValue={postStatus.title!} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label className="float-start white-text">Body Text</Form.Label>
                        <Form.Control as="textarea" rows={10} placeholder="Text" defaultValue={postStatus.body!}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="categories">
                        <Form.Label className="float-start white-text">Categories</Form.Label>
                        <Form.Control type="text" placeholder="categories" defaultValue={postStatus.categories.reduce((x, y) => x + y + " ", "")}/>
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