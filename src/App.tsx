import React from 'react';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import LoginPage from './components/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Startpage';

function App() {
    return (
      <>
        <AppHeader/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </>
    );
}

export default App;
