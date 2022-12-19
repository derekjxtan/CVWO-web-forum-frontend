import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card  from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";

import { fetchPosts } from "../reducers/postsSlice";


export const Posts = () => {
    const dispatch = useDispatch()

    // find some way to handle missing dependency warning in eslint
    useEffect(() => {
        dispatch(fetchPosts());
    }, [])

    const posts = useSelector(state => state.posts).posts

    const postsList = posts.map(post => (
        <Card className="mt-3" key={post.id}>
            <Card.Header>
                <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
                <Row>
                    <Col className="d-flex justify-content-start">
                        <Card.Subtitle>@{post.user.username}, {post.datetime}</Card.Subtitle>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
                    </Col>
                </Row>
                <Card.Subtitle className="d-flex justify-content-start mt-1">Tags: Fun, Games</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>{post.body.substring(0, 100)}</Card.Text>
                <div className="d-flex justify-content-end">
                    <Button variant='success' className="me-2">Like</Button>
                    <Button variant='danger' className="me-2">Dislike</Button>
                    {/* <Nav.Link href={'#'+post.id} className="me-2"><Button variant="primary">See full</Button></Nav.Link> */}
                    <Link to={`/posts/${post.id}`} className='btn btn-primary me-2'>See full</Link>
                    <Button variant='secondary'>Save</Button>
                </div>
            </Card.Body>
        </Card>
    ))

    return (
        <Col xs={8} className='d-inline-flex justify-content-center'>
            <Row lg={1} className='d-inline-flex justify-content-center align-items-center'>
                {postsList}
            </Row>
        </Col>
    ) 
}


// class Posts extends React.Component {
//     render() {
//         // const posts = useSelector(state => state.posts)

//         // const postsList = posts.map(post => (
//         //     <Card className="mt-3" key={post.id}>
//         //         <Card.Header>
//         //             <Card.Title className="d-flex justify-content-start">{post.title}</Card.Title>
//         //             <Row>
//         //                 <Col className="d-flex justify-content-start">
//         //                     <Card.Subtitle>@{post.username}, {post.datetime}</Card.Subtitle>
//         //                 </Col>
//         //                 <Col className="d-flex justify-content-end">
//         //                     <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
//         //                 </Col>
//         //             </Row>
//         //             <Card.Subtitle className="d-flex justify-content-start mt-1">Tags: Fun, Games</Card.Subtitle>
//         //         </Card.Header>
//         //         <Card.Body>
//         //             <Card.Text>{post.body.substring(0, 100)}</Card.Text>
//         //             <div className="d-flex justify-content-end">
//         //                 <Button variant='success' className="me-2">Like</Button>
//         //                 <Button variant='danger' className="me-2">Dislike</Button>
//         //                 <Nav.Link href="#placeholder" className="me-2"><Button variant="primary">See full</Button></Nav.Link>
//         //                 <Button variant='secondary'>Save</Button>
//         //             </div>
//         //         </Card.Body>
//         //     </Card>
//         // ))

//         return (
//             <Col xs={8} className='d-inline-flex justify-content-center'>
//                 <Row lg={1} className='d-inline-flex justify-content-center align-items-center'>
//                     {/* {postsList} */}
//                     <Card className="mt-3">
//                         <Card.Header>
//                             <Card.Title className="d-flex justify-content-start">Post 1 title</Card.Title>
//                             <Row>
//                                 <Col className="d-flex justify-content-start">
//                                     <Card.Subtitle>@user1, 13 Dec 21 7.36pm</Card.Subtitle>
//                                 </Col>
//                                 <Col className="d-flex justify-content-end">
//                                     <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
//                                 </Col>
//                             </Row>
//                             <Card.Subtitle className="d-flex justify-content-start mt-1">Tags: Fun, Games</Card.Subtitle>
//                         </Card.Header>
//                         <Card.Body>
//                             <Card.Text>Post 1 body text is all here maybe it should be abit longer but idk what to put in for this so ill end it here</Card.Text>
//                             <div className="d-flex justify-content-end">
//                                 <Button variant='success' className="me-2">Like</Button>
//                                 <Button variant='danger' className="me-2">Dislike</Button>
//                                 <Nav.Link href="#placeholder" className="me-2"><Button variant="primary">See full</Button></Nav.Link>
//                                 <Button variant='secondary'>Save</Button>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                     <Card className="mt-3">
//                         <Card.Header>
//                             <Card.Title className="d-flex justify-content-start">Post 2 title</Card.Title>
//                             <Row>
//                                 <Col className="d-flex justify-content-start">
//                                     <Card.Subtitle>@user1, 13 Dec 21 7.36pm</Card.Subtitle>
//                                 </Col>
//                                 <Col className="d-flex justify-content-end">
//                                     <Card.Subtitle>Likes: 5, Dislikes: 10</Card.Subtitle>
//                                 </Col>
//                             </Row>
//                         </Card.Header>
//                         <Card.Body>
//                             <Card.Text>Post 1 body text is all here maybe it should be abit longdshshjsdgkhsdlghdfgshldhgdsfkldsjdsghsdjkhdsflghjsdfhgkldsklhgljdgger but idk what to put in for this so ill end it here</Card.Text>
//                             <div className="d-flex justify-content-end">
//                                 <Button variant='success' className="me-2">Like</Button>
//                                 <Button variant='danger'>Dislike</Button>
//                             </div>
//                         </Card.Body>
//                     </Card>
//                 </Row>
//             </Col>
//         );
//     }
// }

// export default Posts;