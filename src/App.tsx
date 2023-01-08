import React, { useEffect } from 'react';

import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { Header } from './components/header';
import { HomePage } from './components/homePage';
import { Post } from './components/post';
import { NewPostForm } from './components/newPostForm';
import { Profile } from './components/profile';
import { EditPostForm } from './components/editPostForm';
import { Categories } from './components/categories';
import { EditReplyForm } from './components/editReplyForm';

import { useAppDispatch } from './app/hooks';

import { checkLogin } from './reducers/userSlice';


function App() {
  const dispatch = useAppDispatch();

  // check login status whenever page is reloaded
  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='posts/:postId' element={<Post />} />
          <Route path='posts/:postId/edit' element={<EditPostForm />} />
          <Route path='/new' element={<NewPostForm />} />
          <Route path='users/:userId' element={<Profile />} />
          <Route path='users/:userId/replies/:replyId/edit' element={<EditReplyForm />} />
          <Route path='categories/:categories' element={<Categories />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
