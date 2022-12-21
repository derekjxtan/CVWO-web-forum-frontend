import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    posts: [
        // {
        //     id: 1,
        //     title: 'Post 1 title',
        //     body: 'Post 1 body is overhere with random stuff inside',
        //     username: 'user1',
        //     datetime: '13 Dec 21 7.36pm',
        //     replies: [
        //         {
        //             id: 1,
        //             body: 'reply 1',
        //             datetime: '13 Dec 21 7.41pm'
        //         },
        //         {
        //             id: 2,
        //             body: 'reply 2',
        //             datetime: '13 Dec 21 7.41pm'
        //         },
        //         {
        //             id: 3,
        //             body: 'reply 3',
        //             datetime: '13 Dec 21 7.41pm',
        //         }
        //     ]
        // },
        // {
        //     id: 2,
        //     title: 'Post 2 title',
        //     body: 'Post 2 body is overhere with random stuff inside',
        //     username: 'user2',
        //     datetime: '14 Dec 21 1.26am',
        //     replies: [
        //         {
        //             id: 4,
        //             body: 'reply 4',
        //             datetime: '14 Dec 21 1.27am'
        //         },
        //         {
        //             id: 5,
        //             body: 'reply 5',
        //             datetime: '14 Dec 21 1.28am'
        //         },
        //         {
        //             id: 6,
        //             body: 'reply 6',
        //             datetime: '14 Dec 21 1.29am'
        //         }
        //     ]
        // }
    ]
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost(state, action) {
            // console.log(action.payload);
            // state.concat(action.payload);
            return {...state, posts: action.payload}
        }
    }
})

export const { addPost } = postsSlice.actions

export default postsSlice.reducer

// fetches all posts from backend and loads them into the store
export const fetchPosts = () => (dispatch) => {
    fetch('http://localhost:3000/posts', {
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
        dispatch(addPost(response));
        return response;
    })
    .catch((err) => {
        return err;
    })
}

// sends attempt to create new post to the backend
export const postNewPost = (title, body, user_id) => (dispatch) => {
    const newPost = {
        title: title,
        body: body,
        user_id: user_id
    }
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
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
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        // dispatch(fetchPosts());
        return response;
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
}