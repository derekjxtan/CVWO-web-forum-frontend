import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../app/store";
import Cookies from "js-cookie";

import { baseUrl } from "./baseUrl";

import { updateUserDisliked, updateUserLiked, updateUserSaved } from "./userSlice";

import { PostInterface } from "../app/interfaces";


interface PostsState {
    isLoading: boolean;
    err: string | null;
    posts: Array<PostInterface>
}

const initialState: PostsState = {
    isLoading: true,
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
        postsLoading(state) {
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

function orderIntToString(order: number) {
    var sort = "newest/";
    switch(order) {
        case 1:
            sort = "oldest/";
            break;
        case 2:
            sort = "most_likes/";
            break;
        case 3:
            sort = "most_dislikes/";
            break;
        default:
            sort = "newest/";
    }
    return sort;
}

// fetches all posts from backend and loads them into the store
export const fetchPosts = (order: number = 0) => (dispatch: AppDispatch) => {
    dispatch(postsLoading());

    fetch(baseUrl + 'get_posts/' + orderIntToString(order), {
        method: 'GET'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
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
export const fetchPostsByCategory = (categories: string, order: number = 0) => (dispatch: AppDispatch) => {
    dispatch(postsLoading());
    fetch(baseUrl + 'categories/' + orderIntToString(order) + categories, {
        method: 'GET'
    })
    .then(response => {
        // console.log(response);
        if (response.ok) {
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
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

// sends attempt to create new post to the backend
export const postNewPost = (title: string, body:string, categories: string, user_id: number) => (dispatch: AppDispatch) => {
    // format categories, split string into array, remove blanks then remove whitespaces for individual entries
    categories = categories.trim();
    if (categories[categories.length - 1] === ',') {
        categories = categories.slice(0, -1);
    }
    var categoriesList = categories.split(" ");
    categoriesList = categoriesList.map(x => x.trim());
    categoriesList = categoriesList.filter(x => x !== '');
    // console.log(categories);
    const token = 'Bearer ' + Cookies.get('token');
    const newPost = {
        title: title,
        body: body,
        categories: categoriesList,
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// send attempt to edit post to the backend
export const editPost = (post_id: number, title: string, body: string, categories: string) => (dispatch: AppDispatch) => {
    // format categories, split string into array, remove blanks then remove whitespaces for individual entries
    categories = categories.trim();
    if (categories[categories.length - 1] === ',') {
        categories = categories.slice(0, -1);
    }
    var categoriesList = categories.split(" ");
    categoriesList = categoriesList.map(x => x.trim());
    categoriesList = categoriesList.filter(x => x !== '');
    // console.log(categories);
    const token = 'Bearer ' + Cookies.get('token');
    const edits = {
        title: title,
        body: body,
        categories: categoriesList
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
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
export const deletePost = (post_id: number) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
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
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to like a post
export const likePost = (user_id: number, post_id: number, liked: Array<PostInterface>, disliked: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const newLike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/like', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike),
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
    .then(response => response.json())
    .then(response => {
        liked = JSON.parse(JSON.stringify(liked));
        disliked = JSON.parse(JSON.stringify(disliked));
        if (Object.keys(response).length !== 0) {
            liked.push(response);
            disliked = disliked.filter(post => post.id !== post_id);
            dispatch(updateUserLiked({liked: liked}));
            dispatch(updateUserDisliked({disliked: disliked}))
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const unlikePost = (user_id: number, post_id: number, liked: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const like = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/like', {
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
            liked = JSON.parse(JSON.stringify(liked))
            liked = liked.filter(post => post.id !== post_id);
            dispatch(updateUserLiked({liked: liked}));
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to dislike a post
export const dislikePost = (user_id: number, post_id: number, disliked: Array<PostInterface>, liked: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const newDislike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/dislike', {
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        liked = JSON.parse(JSON.stringify(liked));
        disliked = JSON.parse(JSON.stringify(disliked));
        if (Object.keys(response).length !== 0) {
            disliked.push(response);
            liked = liked.filter(post => post.id !== post_id);
            dispatch(updateUserLiked({liked: liked}));
            dispatch(updateUserDisliked({disliked: disliked}));
        }
        // console.log(response);
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const undislikePost = (user_id: number, post_id: number, disliked: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const dislike = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/dislike', {
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
            disliked = JSON.parse(JSON.stringify(disliked))
            disliked = disliked.filter(post => post.id !== post_id);
            dispatch(updateUserDisliked({disliked: disliked}));
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to save a post
export const savePost = (user_id: number, post_id: number, saved: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const newSave = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/save', {
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        saved = JSON.parse(JSON.stringify(saved))
        if (Object.keys(response).length !== 0) {
            saved.push(response);
            dispatch(updateUserSaved({saved: saved}));
        }
        // console.log(response);
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to unlike a post
export const unsavePost = (user_id: number, post_id: number, saved: Array<PostInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + Cookies.get('token');
    const save = {
        user_id: user_id,
        post_id: post_id
    }
    fetch(baseUrl + 'posts/' + post_id.toString() + '/save', {
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
            saved = JSON.parse(JSON.stringify(saved))
            saved = saved.filter(post => post.id !== post_id);
            dispatch(updateUserSaved({saved: saved}));
            return response
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}


