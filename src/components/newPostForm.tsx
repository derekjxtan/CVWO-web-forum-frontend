import React, { SyntheticEvent } from "react";

import { useAppSelector } from "../app/hooks";

import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

import Cookies from "js-cookie";

import { baseUrl } from "../reducers/baseUrl";


export const NewPostForm = () => {
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
            // format categories, split string into array, remove blanks then remove whitespaces for individual entries
            var categories = target.categories.value.trim();
            if (categories[categories.length - 1] === ',') {
                categories = categories.slice(0, -1);
            }
            var categoriesList = categories.split(" ");
            categoriesList = categoriesList.map(x => x.trim());
            categoriesList = categoriesList.filter(x => x !== '');
            const token = 'Bearer ' + Cookies.get('token');
            const newPost = {
                title: target.title.value,
                body: target.body.value,
                categories: categoriesList,
                user_id: userStatus.id
            }
            fetch(baseUrl + 'posts', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost),
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok) {
                    return response
                } else {
                    var err = new Error('Error' + response.status + ": " + response.statusText);
                    err.message = response.statusText;
                    throw err;
                }
            })
            .then(response => {
                navigate(-1);
                return response;
            })
            .catch((err) => {
                alert("Failed to submit new post. Please try again");
                return err;
            })
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