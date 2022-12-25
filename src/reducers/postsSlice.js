import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    posts: [
        // {
        //     id: 1,
        //     title: 'Post 1 title',
        //     body: 'Post 1 body is overhere with random stuff inside',
        //     username: 'user1',
        //     datetime: '13 Dec 21 7.36pm',
        //     replies: [
        //         {
        //             id: 1,
        //             body: 'reply 1',
        //             datetime: '13 Dec 21 7.41pm'
        //         },
        //         {
        //             id: 2,
        //             body: 'reply 2',
        //             datetime: '13 Dec 21 7.41pm'
        //         },
        //         {
        //             id: 3,
        //             body: 'reply 3',
        //             datetime: '13 Dec 21 7.41pm',
        //         }
        //     ]
        // },
        // {
        //     id: 2,
        //     title: 'Post 2 title',
        //     body: 'Post 2 body is overhere with random stuff inside',
        //     username: 'user2',
        //     datetime: '14 Dec 21 1.26am',
        //     replies: [
        //         {
        //             id: 4,
        //             body: 'reply 4',
        //             datetime: '14 Dec 21 1.27am'
        //         },
        //         {
        //             id: 5,
        //             body: 'reply 5',
        //             datetime: '14 Dec 21 1.28am'
        //         },
        //         {
        //             id: 6,
        //             body: 'reply 6',
        //             datetime: '14 Dec 21 1.29am'
        //         }
        //     ]
        // }
    ]
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost(state, action) {
            // console.log(action.payload);
            // state.concat(action.payload);
            return {...state, posts: action.payload}
        }
    }
})

export const { addPost } = postsSlice.actions

export default postsSlice.reducer


// Functions for posts

// fetches all posts from backend and loads them into the store
export const fetchPosts = () => (dispatch) => {
    fetch('http://localhost:3000/posts', {
        method: 'GET'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        dispatch(addPost(response));
        return response;
    })
    .catch((err) => {
        return err;
    })
}

// fetch posts by category from backend
export const fetchPostsByCategory = (categories) => (dispatch) => {
    fetch('http://localhost:3000/categories/' + categories, {
        method: 'GET'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        dispatch(addPost(response));
        return response;
    })
    .catch((err) => {
        return err;
    })
}

// fetch single post from backend
export const fetchPost = (post_id) => (dispatch) => {
    fetch('http://localhost:3000/posts/' + post_id.toString(), {
        method: 'GET'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        dispatch(addPost([response]));
        return response;
    })
    .catch((err) => {
        return err;
    })
}

// sends attempt to create new post to the backend
export const postNewPost = (title, body, categories, user_id) => (dispatch) => {
    // format categories, split string into array, remove blanks then remove whitespaces for individual entries
    categories = categories.trim();
    if (categories[categories.length - 1] === ',') {
        categories = categories.slice(0, -1);
    }
    categories = categories.split(" ");
    categories = categories.map(x => x.trim());
    categories = categories.filter(x => x !== '');
    // console.log(categories);
    const newPost = {
        title: title,
        body: body,
        categories: categories,
        user_id: user_id
    }
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost),
        credentials: 'same-origin'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        // dispatch(fetchPosts());
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// send attempt to edit post to the backend
export const editPost = (post_id, title, body, categories) => (dispatch) => {
    // format categories, split string into array, remove blanks then remove whitespaces for individual entries
    categories = categories.trim();
    if (categories[categories.length - 1] === ',') {
        categories = categories.slice(0, -1);
    }
    categories = categories.split(" ");
    categories = categories.map(x => x.trim());
    categories = categories.filter(x => x !== '');
    // console.log(categories);
    const edits = {
        title: title,
        body: body,
        categories: categories
    }
    fetch('http://localhost:3000/posts/' + post_id.toString(), {
        method: 'PUT',
        headers: {
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
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        // dispatch(fetchPosts());
        alert("Post edited");
        console.log(response);
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to delete a post to the backend
export const deletePost = (post_id) => (dispatch) => {
    fetch('http://localhost:3000/posts/' + post_id.toString(), {
        method: 'DELETE'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            alert("Post sucessfully deleted");
            dispatch(fetchPosts());
            return response
        } else {
            if (response.status === 404) {
                alert("Post does not exist");
            } else {
                alert("Error deleting post")
            }
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}


// functions for replies

// sends attempt to create new reply to the backend
export const postNewReply = (body, user_id, post_id) => (dispatch) => {
    const newReply = {
        body: body,
        user_id: user_id,
        post_id: post_id
    }
    fetch('http://localhost:3000/replies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReply),
        credentials: 'same-origin'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        // dispatch(fetchPosts());
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to delete a reply to the backend
export const deleteReply = (reply_id) => (dispatch) => {
    fetch('http://localhost:3000/replies/' + reply_id.toString(), {
        method: 'DELETE'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            alert("Reply sucessfully deleted");
            dispatch(fetchPosts());
            return response
        } else {
            if (response.status === 404) {
                alert("Reply does not exist");
            } else {
                alert("Error deleting post")
            }
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}