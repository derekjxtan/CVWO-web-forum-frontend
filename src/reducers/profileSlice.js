import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    profile: null
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addProfile(state, action) {
            return {...state, profile: action.payload}
        },
        // removeUser(state) {
        //     return {...state, isAuthenticated: false, user: null}
        // }
    }
})

export const { addProfile } = profileSlice.actions

export default profileSlice.reducer

// fetch single profile from backend
export const fetchProfile = (user_id) => (dispatch) => {
    fetch('http://localhost:3000/users/' + user_id.toString(), {
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
        dispatch(addProfile(response));
        return response;
    })
    .catch((err) => {
        return err;
    })
}