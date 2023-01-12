import { configureStore } from '@reduxjs/toolkit';

import thunk from 'redux-thunk';

import postsReducer from '../reducers/postsSlice';
import postReducer from '../reducers/postSlice'
import userReducer from '../reducers/userSlice';
import profileReducer from '../reducers/profileSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    post: postReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch