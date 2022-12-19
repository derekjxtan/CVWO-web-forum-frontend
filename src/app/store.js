import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import postsReducer from '../reducers/postsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});
