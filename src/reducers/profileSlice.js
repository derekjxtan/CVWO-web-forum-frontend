import { createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";


const initialState = {
    isLoading: false,
    err: null,
    profile: null
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        profileSuccess(state, action) {
            return {...state, isLoading: false, err: null, profile: action.payload}
        },
        profileLoading(state, action) {
            return {...state, isLoading: true, err: null, profile: null}
        },
        profileFailed(state, action) {
            return {...state, isLoading: false, err: action.payload, profile: null}
        }
    }
})

export const { profileSuccess, profileLoading, profileFailed } = profileSlice.actions

export default profileSlice.reducer

// fetch single profile from backend
export const fetchProfile = (user_id) => (dispatch) => {
    dispatch(profileLoading());
    const token = 'Bearer ' + localStorage.getItem('token');
    if (localStorage.getItem('token') !== "null") {
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
                err.response = response;
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
                err.response = response;
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