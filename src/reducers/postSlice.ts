import { createSlice } from "@reduxjs/toolkit";

import { ReplyInterface, UserInterface } from "../app/interfaces";

import { AppDispatch } from "../app/store";

import { baseUrl } from "./baseUrl";
import { updateUserDislikedReplies, updateUserLikedReplies } from "./userSlice";

interface PostState {
    isPostLoading: boolean;
    isRepliesLoading: boolean;
    errPost: string | null;
    errReplies: string | null;
    id: number | null;
    likes: number | null;
    dislikes: number | null;
    saves: number | null;
    title: string | null;
    body: string | null;
    categories: Array<string>;
    replies: Array<ReplyInterface>;
    user_id: number | null;
    user: UserInterface | null;
    created_at: string | null;
    updated_at: string | null;
}

const initialState: PostState = {
    isPostLoading: true,
    isRepliesLoading: true,
    errPost: null,
    errReplies: null,
    id: null,
    likes: null,
    dislikes: null,
    saves: null,
    title: null,
    body: null,
    categories: [],
    replies: [],
    user_id: null,
    user: null,
    created_at: null,
    updated_at: null
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        postSuccess(state, action) {
            return {
                ...state, 
                isPostLoading: false, 
                errPost: null, 
                id: action.payload.id,
                likes: action.payload.likes,
                dislikes: action.payload.dislikes,
                saves: action.payload.saves,
                title: action.payload.title,
                body: action.payload.body,
                categories: action.payload.categories,
                user_id: action.payload.user_id,
                user: action.payload.user,
                created_at: action.payload.created_at,
                updated_at: action.payload.updated_at,
            }
        },
        postLoading(state) {
            return {
                ...state, 
                isPostLoading: true, 
                errPost: null, 
                id: null,
                likes: null,
                dislikes: null,
                saves: null,
                title: null,
                body: null,
                categories: [],
                user_id: null,
                user: null,
                created_at: null,
                updated_at: null
            }
        },
        postFailed(state, action) {
            return {
                ...state, 
                isPostLoading: false, 
                errPost: action.payload, 
                id: null,
                likes: null,
                dislikes: null,
                saves: null,
                title: null,
                body: null,
                categories: [],
                user_id: null,
                user: null,
                created_at: null,
                updated_at: null
            }
        },
        repliesSuccess(state, action) {
            return {
                ...state,
                isRepliesLoading: false,
                errReplies: null,
                replies: action.payload
            }
        },
        repliesLoading(state) {
            return {
                ...state,
                isRepliesLoading: true,
                errReplies: null,
                replies: []
            }
        },
        repliesFailed(state, action) {
            return {
                ...state,
                isRepliesLoading: false,
                errReplies: action.payload,
                replies: []
            }
        },
        addReplies(state, action) {
            return {
                ...state,
                replies: state.replies.concat(action.payload)
            }
        }
    }
})

export const { postSuccess, postLoading, postFailed, repliesSuccess, repliesLoading, repliesFailed, addReplies } = postSlice.actions

export default postSlice.reducer

// convert generate string based on order int
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

// fetch single post from backend
export const fetchPost = (post_id: number) => (dispatch: AppDispatch) => {
    dispatch(fetchPostDetails(post_id));
    dispatch(fetchPostReplies(post_id));
}

// fetch post details other than replies
const fetchPostDetails = (post_id: number) => (dispatch: AppDispatch) => {
    dispatch(postLoading());
    fetch(baseUrl + 'posts/' + post_id.toString(), {
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
        dispatch(postSuccess({
            id: response.id,
            likes: response.likes,
            dislikes: response.dislikes,
            saves: response.saves,
            title: response.title,
            body: response.body,
            categories: response.categories,
            user_id: response.user_id,
            user: response.user,
            created_at: response.created_at,
            updated_at: response.updated_at,
        }));
        return response;
    })
    .catch((err) => {
        console.log(err);
        dispatch(postFailed(err.message))
    })
}

// fetch replies of the current post
export const fetchPostReplies = (post_id: number, order: number = 0) => (dispatch: AppDispatch) => {
    dispatch(repliesLoading());
    fetch(baseUrl + 'posts/' + post_id.toString() + '/get_post_replies/' + orderIntToString(order), {
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
        dispatch(repliesSuccess(response));
    })
    .catch((err) => {
        console.log(err);
        dispatch(repliesFailed(err));
    })
}


// functions for replies

// sends attempt to fetch subreplies
export const fetchSubReplies = (reply_id: number, order: number = 0) => (dispatch: AppDispatch) => {
    fetch(baseUrl + 'replies/' + reply_id.toString() + '/get_sub_replies/' + orderIntToString(order), {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        dispatch(addReplies(response));
    })
    .catch(err => {
        console.log(err);
    })
}

// sends attempt to create new reply to the backend
export const postNewReply = (body: string, user_id: number, post_id: number, reply_id: number | null = null, add: boolean = false) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    const newReply = {
        body: body,
        user_id: user_id,
        post_id: post_id,
        reply_id: reply_id
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        if (add) {
            dispatch(addReplies(response))
        }
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// send attempt to edit post to the backend
export const editReply = (reply_id: number, body: string) => (dispatch: AppDispatch) => {
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
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        // dispatch(fetchPosts());
        alert("Reply edited");
        // console.log(response);
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}

// sends attempt to delete a reply to the backend
export const deleteReply = (reply_id: number) => (dispatch: AppDispatch) => {
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
            // dispatch(fetchPost());
            return response
        } else {
            if (response.status === 404) {
                alert("Reply does not exist");
            } else {
                alert("Error deleting post");
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

// Sends attempt to like a reply
// Update user locally if sucessful
export const likeReply = (reply_id: number, liked_r: Array<ReplyInterface>, disliked_r: Array<ReplyInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'replies/' + reply_id.toString() + '/like', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        liked_r = JSON.parse(JSON.stringify(liked_r));
        disliked_r = JSON.parse(JSON.stringify(disliked_r));
        if (Object.keys(response).length !== 0) {
            liked_r.push(response);
            disliked_r = disliked_r.filter(reply => reply.id !==reply_id);
            dispatch(updateUserLikedReplies({liked_r: liked_r}));
            dispatch(updateUserDislikedReplies({disliked_r: disliked_r}));
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

// Sends attempt to unlike a reply
// update user locally if sucessful
export const unlikeReply = (reply_id: number, liked_r: Array<ReplyInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'replies/' + reply_id.toString() + '/like', {
        method: 'DELETE',
        headers: {
            'Authorization': token
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            liked_r = JSON.parse(JSON.stringify(liked_r));
            liked_r = liked_r.filter(reply => reply.id !== reply_id);
            dispatch(updateUserLikedReplies({liked_r: liked_r}))
        }else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

// sends attempt to dislike reply
// update user locally if sucessful
export const dislikeReply = (reply_id: number, disliked_r: Array<ReplyInterface>, liked_r: Array<ReplyInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'replies/' + reply_id.toString() + '/dislike', {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response;
        }else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        liked_r = JSON.parse(JSON.stringify(liked_r));
        disliked_r = JSON.parse(JSON.stringify(disliked_r));
        if (Object.keys(response).length !== 0) {
            disliked_r.push(response);
            liked_r = liked_r.filter(reply => reply.id !==reply_id);
            dispatch(updateUserLikedReplies({liked_r: liked_r}));
            dispatch(updateUserDislikedReplies({disliked_r: disliked_r}));
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

// send attempt to undislike reply
// update user locally if successful
export const undislikeReply = (reply_id: number, disliked_r: Array<ReplyInterface>) => (dispatch: AppDispatch) => {
    const token = 'Bearer ' + localStorage.getItem('token');
    fetch(baseUrl + 'replies/' + reply_id.toString() + '/dislike', {
        method: 'DELETE',
        headers: {
            'Authorization': token
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            disliked_r = JSON.parse(JSON.stringify(disliked_r));
            disliked_r = disliked_r.filter(reply => reply.id !== reply_id);
            dispatch(updateUserDislikedReplies({disliked_r: disliked_r}))
        }else {
            var err = new Error('Error' + response.status + ": " + response.statusText);
            err.message = response.statusText;
            throw err;
        }
    })
    .catch((err) => {
        console.log(err);
    })
}