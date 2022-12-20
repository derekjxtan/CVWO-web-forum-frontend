import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Modal  from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';

import { login } from "../reducers/userSlice";



export const Header = () => {
    const dispatch = useDispatch();

    const userStatus = useSelector(state => state.user)

    const [showLogin, setLogin] = useState(false);
    const [showRegister, setRegister] = useState(false);

    const toggleLogin = () => setLogin(!showLogin);
    const toggleRegister = () => setRegister(!showRegister);

    const loginUser = (e) => {
        e.preventDefault();
        dispatch(login(e.target[1].value, e.target[2].value));
    }

    // TO BE IMPLEMENTED
    const handleRegister = () => {
        alert("Register loh");
    }

    return (
        <Navbar bg='light' expand='lg'>
            <Container>
                <Navbar.Brand href='/'>Gossip</Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar'/>
                <Navbar.Collapse id='basic-navbar'>
                    <Nav className="me-auto">
                        <Nav.Link href='/'>Home</Nav.Link>
                        <NavDropdown title="Categories" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                        {
                            userStatus.isAuthenticated
                            ?
                                <Nav.Link href='/saved'>Saved</Nav.Link>
                            :
                                <div />
                        }
                    </Nav>

                    {
                        userStatus.isAuthenticated
                        ?
                            <Nav className="ms-auto">
                                <Nav.Link href="#profile">{userStatus.user.username}</Nav.Link>
                            </Nav>
                        :
                            <div>
                                <Nav>
                                    <Button variant="primary" onClick={toggleLogin}>Log in</Button>
                                    <Button variant="primary" className="ms-1" onClick={toggleRegister}>Register</Button>
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
                                                <Form.Control type="password" placeholder="Password"/>
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={toggleLogin}>
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Login
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
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Register
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