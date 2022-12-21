import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { Header } from './components/header';
import { Posts } from './components/posts';
import { Post } from './components/post';
import { NewPostForm } from './components/newPostForm';

import { useDispatch } from 'react-redux';

import { checkLogin } from './reducers/userSlice';


function App({posts}) {
  const dispatch = useDispatch();

  // check login status whenever page is reloaded
  useEffect(() => {
    dispatch(checkLogin());
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Posts />} />
          <Route exact path='posts/:postId' element={<Post />} />
          <Route exact path='/new' element={<NewPostForm />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
