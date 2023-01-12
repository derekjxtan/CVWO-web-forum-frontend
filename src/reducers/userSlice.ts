import { createSlice } from "@reduxjs/toolkit";
import { PostInterface, ReplyInterface } from "../app/interfaces";
import { AppDispatch } from "../app/store";
import { baseUrl } from "./baseUrl";


interface UserState {
    isLoading: boolean;
    err: string | null;
    isAuthenticated: boolean;
    id: number | null;
    username: string | null;
    posts: Array<PostInterface>;
    replies: Array<ReplyInterface>;
    liked: Array<PostInterface>;
    disliked: Array<PostInterface>;
    saved: Array<PostInterface>;
    liked_r: Array<ReplyInterface>;
    disliked_r: Array<ReplyInterface>;
}

const initialState: UserState = {
    isLoading: false,
    err: null,
    isAuthenticated: false,
    id: null,
    username: null,
    posts: [],
    replies: [],
    liked: [],
    disliked: [],
    saved: [],
    liked_r: [],
    disliked_r: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userSuccess(state, action) {
            localStorage.setItem('isAuthenticated', "true");
            localStorage.setItem('id', action.payload.id);
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('posts', JSON.stringify(action.payload.posts));
            localStorage.setItem('replies', JSON.stringify(action.payload.replies));
            localStorage.setItem('liked', JSON.stringify(action.payload.liked));
            localStorage.setItem('disliked', JSON.stringify(action.payload.disliked));
            localStorage.setItem('saved', JSON.stringify(action.payload.saved));
            localStorage.setItem('liked_r', JSON.stringify(action.payload.liked_r));
            localStorage.setItem('disliked_r', JSON.stringify(action.payload.disliked_r));
            return {
                ...state,
                isLoading: false,
                err: null,
                isAuthenticated: true,
                id: action.payload.id,
                username: action.payload.username,
                posts: action.payload.posts,
                replies: action.payload.replies,
                liked: action.payload.liked,
                disliked: action.payload.disliked,
                saved: action.payload.saved,
                liked_r: action.payload.liked_r,
                disliked_r: action.payload.disliked_r
            }
        },
        userLoading(state) {
            return {
                ...state,
                isLoading: true,
                err: null,
                isAuthenticated: false,
                id: null,
                username: null,
                posts: [],
                replies: [],
                liked: [],
                disliked: [],
                saved: [],
                liked_r: [],
                disliked_r: []
            }
        },
        userFailed(state, action) {
            return {
                ...state,
                isLoading: false,
                err: action.payload,
                isAuthenticated: false,
                id: null,
                username: null,
                posts: [],
                replies: [],
                liked: [],
                disliked: [],
                saved: [],
                liked_r: [],
                disliked_r: []
            }
        },
        removeUser(state) {
            localStorage.setItem('isAuthenticated', "false");
            localStorage.setItem('id', "null");
            localStorage.setItem('username', "null");
            localStorage.setItem('posts', JSON.stringify([]));
            localStorage.setItem('replies', JSON.stringify([]));
            localStorage.setItem('liked', JSON.stringify([]));
            localStorage.setItem('disliked', JSON.stringify([]));
            localStorage.setItem('saved', JSON.stringify([]));
            localStorage.setItem('liked_r', JSON.stringify([]));
            localStorage.setItem('disliked_r', JSON.stringify([]));
            return {
                ...state,
                isLoading: false,
                err: null,
                isAuthenticated: false,
                user_id: null,
                username: null,
                posts: [],
                replies: [],
                liked: [],
                disliked: [],
                saved: [],
                liked_r: [],
                disliked_r: []
            }
        },
        updateUserLiked(state, action) {
            localStorage.setItem('liked', JSON.stringify(action.payload.liked));
            return {
                ...state,
                liked: action.payload.liked
            }
        },
        updateUserDisliked(state, action) {
            localStorage.setItem('disliked', JSON.stringify(action.payload.disliked));
            return {
                ...state,
                disliked: action.payload.disliked
            }
        },
        updateUserSaved(state, action) {
            localStorage.setItem('saved', JSON.stringify(action.payload.saved));
            return {
                ...state,
                saved: action.payload.saved
            }
        },
        updateUserLikedReplies(state, action) {
            localStorage.setItem('liked_r', JSON.stringify(action.payload.liked_r));
            return {
                ...state,
                liked_r: action.payload.liked_r
            }
        },
        updateUserDislikedReplies(state, action) {
            localStorage.setItem('disliked_r', JSON.stringify(action.payload.disliked_r));
            return {
                ...state,
                disliked_r: action.payload.disliked_r
            }
        }
    }
})

export const { userSuccess, userLoading, userFailed, removeUser, updateUserLiked, updateUserDisliked, updateUserSaved, updateUserLikedReplies, updateUserDislikedReplies } = userSlice.actions

export default userSlice.reducer

// checks login status from local storage
// loads stored data into the store if user has already logged in
export const checkLogin = () => (dispatch: AppDispatch) => {
    const loginStatus = localStorage.getItem('isAuthenticated');
    if (loginStatus === "true") {
        dispatch(userSuccess({
            id: parseInt(localStorage.getItem('id')!),
            username: localStorage.getItem('username')!,
            posts: JSON.parse(localStorage.getItem('posts')!),
            replies: JSON.parse(localStorage.getItem('replies')!),
            liked: JSON.parse(localStorage.getItem('liked')!),
            disliked: JSON.parse(localStorage.getItem('disliked')!),
            saved: JSON.parse(localStorage.getItem('saved')!),
            liked_r: JSON.parse(localStorage.getItem('liked_r')!),
            disliked_r: JSON.parse(localStorage.getItem('disliked_r')!)
        }));
    }
    // console.log("checkLogin Called");
}

// sends attempt to log in to the backend.
// stores log in status to local storage to provide data persistence
export const login = (username: string, password: string) => (dispatch: AppDispatch) => {
    const loginDetails = {
        username: username,
        password: password
    };
    fetch(baseUrl + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDetails),
        credentials: 'same-origin',
        redirect: 'follow'
    })
    .then((resp) => {
        if (resp.ok) {
            return resp;
        } else {
            if (resp.status === 401) {
                alert("username or password is wrong. Please try again");
            }
            var err = new Error(resp.statusText);
            throw err;
        }
    })
    .then((response) => response.json())
    .then((response) => {
        localStorage.setItem('token', response.token);
        dispatch(userSuccess({
            id: parseInt(response.user.id),
            username: response.user.username,
            posts: response.user.posts,
            replies: response.user.replies,
            liked: response.user.liked,
            disliked: response.user.disliked,
            saved: response.user.saved,
            liked_r: response.user.liked_r,
            disliked_r: response.user.disliked_r
        }));
    })
    .catch((error) => {
        console.log(error);
    })
}

// logs user out from account
// overrides data in the store and local storage
export const logout = () => (dispatch: AppDispatch) => {
    localStorage.setItem('token', "null");
    dispatch(removeUser())
}

// send request to register a new user to the backend
export const register = (username: string, password: string) => (dispatch: AppDispatch) => {
    const registerDetails = {
        username: username,
        password: password
    };
    fetch(baseUrl + 'users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerDetails),
        credentials: 'same-origin'
    })
    .then((response) => response.json())
    .then((response) => {
        if (response.username[0] === 'has already been taken') {
            alert("Registration failed. Username has been taken");
            var err = new Error('Username taken');
            err.message = response.statusText;
            throw err;
        } else {
            alert("Register Sucessfully. Log in to continue.");
        }
    })
    .catch((error) => {
        // console.log(error);
        alert('Registration could not be posted\n' + error.message);
    })
}