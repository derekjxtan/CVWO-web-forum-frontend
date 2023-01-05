import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal  from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';

import { login, logout, register } from "../reducers/userSlice";

import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";



export const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userStatus = useSelector(state => state.user)

    const [showLogin, setLogin] = useState(false);
    const [showRegister, setRegister] = useState(false);

    const toggleLogin = () => setLogin(!showLogin);
    const toggleRegister = () => setRegister(!showRegister);

    // called when user attempts to log in
    // dispatches login function from userSlice
    const loginUser = (e) => {
        e.preventDefault();
        dispatch(login(e.target[1].value, e.target[2].value));
        navigate();
    }

    // called when user attempts to register a new account
    // dispatches register function from userSlice
    const handleRegister = (e) => {
        e.preventDefault();
        // console.log(e.target[1].value, e.target[2].value);
        dispatch(register(e.target[1].value, e.target[2].value));
        navigate();
    }

    // called when user attempts to log out
    // dispatches logout function from userSlice
    const logoutUser = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate();
    }

    // format url and navigate to categories
    const searchCategories = (e) => {
        // console.log(e.target[0].value);
        let categories = e.target[0].value.split(' ');
        let path = `/categories/`;
        for (let i = 0; i < categories.length; i++) {
            const currCat = categories[i].trim();
            if (currCat === "") {
                continue;
            }
            path += currCat;
            if (i !== categories.length - 1) {
                path += '&';
            }
        }
        navigate(path);
    }

    return (
        <Navbar expand='lg'>
            <Container>
                <Navbar.Brand href='/'>Gossip</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar'/>
                <Navbar.Collapse id='basic-navbar'>
                    <Nav className="me-auto">
                        <Nav.Link href='/'>
                            <FontAwesomeIcon icon={solid('house')}/> Home
                        </Nav.Link>
                        {
                            userStatus.isAuthenticated
                            ?
                            <Nav>
                                <Link to={`/new`} className='btn'>
                                    <FontAwesomeIcon icon={solid('plus')}/> New Post
                                </Link>
                            </Nav>
                            :
                                <div />
                        }
                    </Nav>

                    {
                        userStatus.isAuthenticated
                        ?
                            <Nav className="ms-auto">
                                <Form className="d-flex me-3" onSubmit={searchCategories}>
                                    <Form.Control type='search' placeholder="Search Categories" className="me-2" />
                                    <Button variant="outline-dark" type="submit"><FontAwesomeIcon icon={solid('magnifying-glass')} size='lg'/></Button>
                                </Form>
                                <Nav.Link href={`/users/${userStatus.user.id}`} className='btn me-2'>
                                    <FontAwesomeIcon icon={solid('user')}/> {userStatus.user.username}
                                </Nav.Link>
                                <Button variant="primary" className="" onClick={logoutUser}>
                                    <FontAwesomeIcon icon={solid('right-from-bracket')}/> Log out
                                </Button>
                            </Nav>
                        :
                            <div>
                                <Nav>
                                    <Form className="d-flex me-3" onSubmit={searchCategories}>
                                        <Form.Control type='search' placeholder="Search Categories" className="me-2" />
                                        <Button variant="outline-dark" type="submit"><FontAwesomeIcon icon={solid('magnifying-glass')}/></Button>
                                    </Form>
                                    <Button variant="primary" onClick={toggleLogin}>
                                        <FontAwesomeIcon icon={solid('right-to-bracket')}/> Log in
                                    </Button>
                                    <Button variant="primary" className="ms-1" onClick={toggleRegister}>
                                        <FontAwesomeIcon icon={solid('user-plus')}/> Register
                                    </Button>
                                </Nav>

                                <Modal show={showLogin} onHide={toggleLogin}>
                                    <Form onSubmit={loginUser}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Login</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Group className="mb-3" controlId="formUsername">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control type="text" placeholder="Username" required/>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" required/>
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={toggleLogin}>
                                                <FontAwesomeIcon icon={solid('ban')}/> Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                <FontAwesomeIcon icon={solid('right-to-bracket')}/> Log in
                                            </Button>                                
                                        </Modal.Footer>
                                    </Form>
                                </Modal>

                                <Modal show={showRegister} onHide={toggleRegister}>
                                    <Form onSubmit={handleRegister}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Register</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Group className="mb-3" controlId="formUsername">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control type="text" placeholder="Username" required />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" required />
                                            </Form.Group>
                                            {/* <Form.Group className="mb-3" controlId="formRePassword">
                                                <Form.Label>Retype Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" required />
                                            </Form.Group> */}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={toggleRegister}>
                                                <FontAwesomeIcon icon={solid('ban')}/> Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                <FontAwesomeIcon icon={solid('user-plus')}/> Register
                                            </Button>                                
                                        </Modal.Footer>
                                    </Form>
                                </Modal>
                            </div>    
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>        
    );
}