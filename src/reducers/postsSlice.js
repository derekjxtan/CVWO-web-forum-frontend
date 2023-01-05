import { createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";

import { userSuccess } from "./userSlice";

const initialState = {
    isLoading: false,
    err: null,
    posts: []
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsSuccess(state, action) {
            return {...state, isLoading: false, err: null, posts: action.payload}
        },
        postsLoading(state, action) {
            return {...state, isLoading: true, err: null, posts: []}
        },
        postsFailed(state, action) {
            return {...state, isLoading: false, err: action.payload, posts: []}
        }
    }
})

export const { postsSuccess, postsLoading, postsFailed } = postsSlice.actions

export default postsSlice.reducer


// Functions for posts

// fetches all posts from backend and loads them into the store
export const fetchPosts = () => (dispatch) => {
    dispatch(postsLoading());
    fetch(baseUrl + 'posts', {
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
        dispatch(postsSuccess(response));
        return response;
    })
    .catch((err) => {
        dispatch(postsFailed(err.message));
        return err;
    })
}

// fetch posts by category from backend
export const fetchPostsByCategory = (categories) => (dispatch) => {
    dispatch(postsLoading());
    fetch(baseUrl + 'categories/' + categories, {
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
        dispatch(postsSuccess(response));
        return response;
    })
    .catch((err) => {
        console.log(err);
        dispatch(postsFailed(err.message))
        return err;
    })
}

// fetch single post from backend
export const fetchPost = (post_id) => (dispatch) => {
    dispatch(postsLoading());
    fetch(baseUrl + 'posts/' + post_id.toString(), {
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
        dispatch(postsSuccess([response]));
        return response;
    })
    .catch((err) => {
        dispatch(postsFailed(err.message))
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
    const token = 'Bearer ' + localStorage.getItem('token');
    const newPost = {
        title: title,
        body: body,
        categories: categories,
        user_id: user_id
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
    const token = 'Bearer ' + localStorage.getItem('token');
    const edits = {
        title: title,
        body: body,
        categories: categories
    }
    fetch(baseUrl + 'posts/' + post_id.toString(), {
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
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'posts/' + post_id.toString(), {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
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

// sends attempt to like a post
export const likePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const newLike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'like', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike),
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
        user = JSON.parse(JSON.stringify(user));
        if (Object.keys(response).length !== 0) {
            user.liked.push(response);
            user.disliked = user.disliked.filter(post => post.id !== post_id);
            dispatch(userSuccess({user: user}));
        }
        // console.log(response);
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const unlikePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const like = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'like', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(like),
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            user = JSON.parse(JSON.stringify(user))
            user.liked = user.liked.filter(post => post.id !== post_id);
            dispatch(userSuccess({user: user}));
            return response
        } else {
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

// sends attempt to dislike a post
export const dislikePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const newDislike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'dislike', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDislike),
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
        user = JSON.parse(JSON.stringify(user));
        if (Object.keys(response).length !== 0) {
            user.disliked.push(response);
            user.liked = user.liked.filter(post => post.id !== post_id);
            dispatch(userSuccess({user: user}));
        }
        // console.log(response);
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const undislikePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const dislike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'dislike', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dislike),
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            user = JSON.parse(JSON.stringify(user))
            user.disliked = user.liked.filter(post => post.id !== post_id);
            dispatch(userSuccess({user: user}));
            return response
        } else {
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

// sends attempt to save a post
export const savePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const newSave = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'save', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSave),
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
        user = JSON.parse(JSON.stringify(user))
        if (Object.keys(response).length !== 0) {
            user.saved.push(response);
            dispatch(userSuccess({user: user}));
        }
        // console.log(response);
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const unsavePost = (user_id, post_id, user) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const save = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'save', {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(save),
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            user = JSON.parse(JSON.stringify(user))
            user.saved = user.saved.filter(post => post.id !== post_id);
            dispatch(userSuccess({user: user}));
            return response
        } else {
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
    const token = 'Bearer ' + localStorage.getItem('token');
    const newReply = {
        body: body,
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'replies', {
        method: 'POST',
        headers: {
            'Authorization': token,
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

// send attempt to edit post to the backend
export const editReply = (reply_id, body) => (dispatch) => {
    // console.log(categories);
    const token = 'Bearer ' + localStorage.getItem('token');
    const edits = {
        body: body
    }
    fetch(baseUrl + 'replies/' + reply_id.toString(), {
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
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        // dispatch(fetchPosts());
        alert("Reply edited");
        console.log(response);
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to delete a reply to the backend
export const deleteReply = (reply_id) => (dispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'replies/' + reply_id.toString(), {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
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