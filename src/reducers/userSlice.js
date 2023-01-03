import { createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "./baseUrl";


const initialState = {
    isAuthenticated: false,
    user: null
    // user_id: null,
    // username: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action) {
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            return {...state, isAuthenticated: true, user: action.payload.user}
        },
        removeUser(state) {
            localStorage.setItem('isAuthenticated', false);
            localStorage.setItem('user', null);
            return {...state, isAuthenticated: false, token: null,user: null}
        }
    }
})

export const { addUser, removeUser, addLike, removeLike } = userSlice.actions

export default userSlice.reducer

// checks login status from local storage
// loads stored data into the store if user has already logged in
export const checkLogin = () => (dispatch) => {
    const loginStatus = localStorage.getItem('isAuthenticated');
    if (loginStatus === "true") {
        // console.log("already logged in");
        dispatch(addUser({
            user: JSON.parse(localStorage.getItem('user'))
        }));
    }
    console.log("checkLogin Called");
}

// sends attempt to log in to the backend.
// stores log in status to local storage to provide data persistence
export const login = (username, password) => (dispatch) => {
    const loginDetails = {
        username: username,
        password: password
    };
    fetch(baseUrl + 'login', {
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
        dispatch(addUser(response));
    })
    .catch((error) => {
        console.log(error);
    })
}

// logs user out from account
// overrides data in the store and local storage
export const logout = () => (dispatch) => {
    localStorage.setItem('token', null);
    dispatch(removeUser())
}

// send request to register a new user to the backend
export const register = (username, password) => (dispatch) => {
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
            err.response = response;
            throw err;
        } else {
            alert("Register Sucessfully. Log in to continue.");
            // dispatch(addUser(response));
        }
    })
    .catch((error) => {
        // console.log(error);
        alert('Registration could not be posted\n' + error.message);
    })
}