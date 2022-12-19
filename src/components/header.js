import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Modal  from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            user: null,
            showLogin: false,
            showRegister: false
        };
        this.toggleLogin = this.toggleLogin.bind(this);
        this.toggleRegister = this.toggleRegister.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
    }

    // Controls toggling of Login Modal
    toggleLogin(e) {
        this.setState({showLogin: !this.state.showLogin});
    }

    // Controls toggling of Register Modal
    toggleRegister(e) {
        this.setState({showRegister: !this.state.showRegister});
    }

    // Handles submission of Login
    submitLogin(e) {
        // console.log(e);
        this.setState({user: e.target[1].value, authenticated: true});
        this.toggleLogin(e);
    }

    // Handles submission of Register
    submitRegister(e) {

    }

    render() {
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
                                this.state.authenticated
                                ?
                                    <Nav.Link href='/saved'>Saved</Nav.Link>
                                :
                                    <div />
                            }
                        </Nav>

                        {
                            this.state.authenticated
                            ?
                                <Nav className="ms-auto">
                                    <Nav.Link href="#profile">{this.state.user}</Nav.Link>
                                </Nav>
                            :
                                <div>
                                    <Nav>
                                        <Button variant="primary" onClick={this.toggleLogin}>Log in</Button>
                                        <Button variant="primary" className="ms-1" onClick={this.toggleRegister}>Register</Button>
                                    </Nav>

                                    <Modal show={this.state.showLogin} onHide={this.toggleLogin}>
                                        <Form onSubmit={this.submitLogin}>
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
                                                <Button variant="secondary" onClick={this.toggleLogin}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" type="submit">
                                                    Login
                                                </Button>                                
                                            </Modal.Footer>
                                        </Form>
                                    </Modal>

                                    <Modal show={this.state.showRegister} onHide={this.toggleRegister}>
                                        <Form onSubmit={this.submitRegister}>
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
                                                <Button variant="secondary" onClick={this.toggleRegister}>
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
}

export default Header;