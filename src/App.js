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

import { useDispatch } from 'react-redux';

import { checkLogin } from './reducers/userSlice';
import { Posts } from './components/posts';


function App() {
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
          <Route path='/' element={<HomePage />} />
          {/* <Route path='/' element={<Posts />} /> */}
          <Route exact path='posts/:postId' element={<Post />} />
          <Route exact path='posts/:postId/edit' element={<EditPostForm />} />
          <Route exact path='/new' element={<NewPostForm />} />
          <Route path='users/:userId' element={<Profile />} />
          <Route path='categories/:categories' element={<Categories />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
