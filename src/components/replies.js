import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { deleteReply } from '../reducers/postsSlice';


export const Replies = (props) => {
    const dispatch = useDispatch();

    const replies = props.replies;

    // called when attempting to delete a reply
    // dispatches deleteReply function from postsSlice
    const handleDelete = (reply_id) => {
        alert("Deleting reply " + reply_id);
        dispatch(deleteReply(reply_id));
    }

    const singleReply = (reply) => (
        <Card className="mt-3" key={reply.id}>
            <Card.Header>
                <Card.Subtitle className="d-flex justify-content-start">{reply.created_at}</Card.Subtitle>
            </Card.Header>
            <Card.Body>
                <Card.Text>{reply.body}</Card.Text>
                <div className="d-flex justify-content-end">
                    <Link to={`/posts/${reply.post_id}`} className='btn btn-primary me-2'>See Post</Link>
                    <Button variant="danger" onClick={() => handleDelete(reply.id)}>Delete</Button>
                </div>
            </Card.Body>
        </Card>
    )

    const repliesList = replies.map(reply => (singleReply(reply)));

    return (
        <Container className="col-8 mt-3">
            <Container>
                {repliesList}
            </Container>
        </Container>
    )
}