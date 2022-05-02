import React from 'react';

import logo from './icon.png';
import './App.css';
import AppHeader from './components/AppHeader';
import LoginPage from './components/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Startpage from './components/Startpage';

function App() {
  return (
    <>
      <AppHeader></AppHeader>
      <Routes>
        <Route path="/" element={<Startpage/>}>
          
        </Route>
        <Route path="/login" element={<LoginPage/>}>
        

        </Route>
      </Routes>
      
      

      

    </>
    // <Router>
    //   <Route path="/login">
          
    //   </Route>
    //   <Route path="/"> 
    //     <div className="App">
    //       <AppHeader></AppHeader>
    //       <img src={logo} className="App-logo" alt="logo" />
    //     </div>
    //   </Route>

    // </Router>
  );
}

export default App;
