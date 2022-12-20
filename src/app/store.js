import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import postsReducer from '../reducers/postsSlice';
import userReducer from '../reducers/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
