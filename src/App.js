import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { Header } from './components/header';
import { Posts } from './components/posts';
import { Post } from './components/post';


function App({posts}) {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/' element={<Posts />} />
          <Route exact path='posts/:postId' element={<Post />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
