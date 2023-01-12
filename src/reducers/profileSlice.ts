import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "../app/interfaces";
import { AppDispatch } from "../app/store";
import { baseUrl } from "./baseUrl";


interface ProfileState {
    isLoading: boolean;
    err: string | null;
    profile: UserInterface | null;
}

const initialState: ProfileState = {
    isLoading: true,
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
        profileLoading(state) {
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
export const fetchProfile = (user_id: number) => (dispatch: AppDispatch) => {
    dispatch(profileLoading());
    const token = 'Bearer ' + localStorage.getItem('token');
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== "null") {
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