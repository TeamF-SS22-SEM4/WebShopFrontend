import React from 'react';

import logo from './icon.png';
import './App.css';
import AppHeader from './components/AppHeader';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <>
      <LoginPage></LoginPage>
      <AppHeader></AppHeader>
      <img src={logo} className="App-logo" alt="logo" />

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
