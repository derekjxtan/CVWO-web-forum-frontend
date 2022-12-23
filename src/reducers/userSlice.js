import { createSlice } from "@reduxjs/toolkit";


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
            return {...state, isAuthenticated: true, user: action.payload}
        },
        removeUser(state) {
            return {...state, isAuthenticated: false, user: null}
        }
    }
})

export const { addUser, removeUser } = userSlice.actions

export default userSlice.reducer

// checks login status from local storage
// loads stored data into the store if user has already logged in
export const checkLogin = () => (dispatch) => {
    const loginStatus = localStorage.getItem('isAuthenticated');
    if (loginStatus === "true") {
        // console.log("already logged in");
        dispatch(addUser(JSON.parse(localStorage.getItem('user'))));
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
        if (response === null) {
            alert("Login failed. Username or password is wrong.")
        } else {
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('user', JSON.stringify(response));
            dispatch(addUser(response));
        }
    })
    .catch((error) => {
        console.log(error);
        alert('Login could not be posted\nError: ' + error.message);
    })
}

// logs user out from account
// overrides data in the store and local storage
export const logout = () => (dispatch) => {
    localStorage.setItem('isAuthenticated', false);
    localStorage.setItem('user', null);
    dispatch(removeUser())
}

// send request to register a new user to the backend
export const register = (username, password) => (dispatch) => {
    const registerDetails = {
        username: username,
        password: password
    };
    fetch('http://localhost:3000/users', {
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