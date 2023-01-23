import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { PostInterface, ReplyInterface } from "../app/interfaces";
import { AppDispatch } from "../app/store";
import { baseUrl } from "./baseUrl";


interface ProfileState {
    isLoading: boolean;
    err: string | null;
    id: number | null;
    username: string | null;
    posts: Array<PostInterface>;
    replies: Array<ReplyInterface>;
    liked: Array<PostInterface>;
    disliked: Array<PostInterface>;
    saved: Array<PostInterface>;
}

// const initialState: ProfileState = {
//     isLoading: true,
//     err: null,
//     profile: null
// }

const initialState: ProfileState = {
    isLoading: false,
    err: null,
    id: null,
    username: null,
    posts: [],
    replies: [],
    liked: [],
    disliked: [],
    saved: [],
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        profileSuccess(state, action) {
            return {
                ...state, 
                isLoading: false, 
                err: null, 
                id: action.payload.id,
                username: action.payload.username,
                posts: action.payload.posts,
                replies: action.payload.replies,
                liked: action.payload.liked,
                disliked: action.payload.disliked,
                saved: action.payload.saved,
            }
        },
        profileLoading(state) {
            return {
                ...state, 
                isLoading: true, 
                err: null,
                id: null,
                username: null,
                posts: [],
                replies: [],
                liked: [],
                disliked: [],
                saved: [],
            }
        },
        profileFailed(state, action) {
            return {
                ...state, 
                isLoading: false, 
                err: action.payload,
                id: null,
                username: null,
                posts: [],
                replies: [],
                liked: [],
                disliked: [],
                saved: [],
            }
        },
        updateProfilePosts(state, action) {
            return {
                ...state,
                posts: action.payload
            }
        },
        updateProfileReplies(state, action) {
            return {
                ...state,
                replies: action.payload
            }
        },
        updateProfileLiked(state, action) {
            return {
                ...state,
                liked: action.payload
            }
        },
        updateProfileDisliked(state, action) {
            return {
                ...state,
                disliked: action.payload
            }
        },
        updateProfileSaved(state, action) {
            return {
                ...state,
                saved: action.payload
            }
        }
    }
})

export const { profileSuccess, profileLoading, profileFailed, updateProfilePosts, updateProfileReplies, updateProfileLiked, updateProfileDisliked, updateProfileSaved } = profileSlice.actions

export default profileSlice.reducer

// fetch single profile from backend
export const fetchProfile = (user_id: number) => (dispatch: AppDispatch) => {
    dispatch(profileLoading());
    const token = 'Bearer ' + Cookies.get('token');
    if (Cookies.get('token') !== undefined) {
        fetch(baseUrl + 'users/' + user_id.toString(), {
            method: 'GET',
            headers: {
                'Authorization': token
            }
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
            dispatch(profileSuccess(response));
            return response;
        })
        .catch((err) => {
            dispatch(profileFailed(err.message));
            return err;
        })
    } else {
        fetch(baseUrl + 'users/' + user_id.toString(), {
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
            dispatch(profileSuccess(response));
            return response;
        })
        .catch((err) => {
            return err;
        })
    }
}