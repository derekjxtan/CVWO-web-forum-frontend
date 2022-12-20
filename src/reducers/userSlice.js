import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuthenticated: false,
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action) {
            return {...state, isAuthenticated: true, user: action.payload}
        }
    }
})

export const { addUser } = userSlice.actions

export default userSlice.reducer

export const login = (username, password) => (dispatch) => {
    const loginDetails = {
        username: username,
        password: password
    };
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginDetails),
        credentials: 'same-origin'
    })
    .then((resp) => {
        if (resp.ok) {
            return resp;
        } else {
            var err = new Error('Error ' + resp.status + ': ' + resp.statusText);
            err.response = resp;
            throw err;
        }
    })
    .then((response) => response.json())
    .then((response) => {
        // console.log(response);
        dispatch(addUser(response))
    })
    .catch((error) => {
        console.log(error);
        alert('Login could not be posted\nError: ' + error.message);
    })
}