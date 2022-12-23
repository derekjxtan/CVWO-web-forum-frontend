import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import postsReducer from '../reducers/postsSlice';
import userReducer from '../reducers/userSlice';
import profileReducer from '../reducers/profileSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
