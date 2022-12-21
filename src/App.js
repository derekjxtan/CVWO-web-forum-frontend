import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { Header } from './components/header';
import { Posts } from './components/posts';
import { Post } from './components/post';
import { NewPostForm } from './components/newPostForm';


function App({posts}) {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        {/* <NewPostForm /> */}
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
