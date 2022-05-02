import React, {useEffect, useState} from 'react';

import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import LoginPage from './components/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Startpage';

export type AuthenticationContextType = {
    sessionId: string;
    username: string;
    loggedIn: boolean;
    login: (s: string, u: string) => void
}

let contextValue: AuthenticationContextType = {
    sessionId: "",
    username: "",
    loggedIn: false,
    login: (s: string, u: string) => {}
}

export const AuthenticationContext = React.createContext(contextValue)

function App(this: any) {

    let [authState, setAuthState] = useState(contextValue)

    useEffect(() => {
        setAuthState(prevState => {
            return {
                ...prevState,
                login: (s: string, u: string) => {
                    setAuthState((prev => {
                        return {...prev,
                            loggedIn: true,
                            username: u,
                            sessionId: s
                        }
                    }))
                }
            }
        })
    }, []);

    return (
      <AuthenticationContext.Provider value={authState}>
        <AppHeader/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </AuthenticationContext.Provider>
    );
}

export default App;
