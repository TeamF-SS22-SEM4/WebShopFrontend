import React, {useEffect, useState} from 'react';
import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import LoginPage from './components/LoginPage/LoginPage';
import {Route, Routes} from 'react-router-dom';
import Startpage from "./components/StartPage/Startpage";
import SearchPage from "./components/SearchPage/SearchPage";
import {Configuration, DefaultApi} from "./openapi-client";

const host = process.env.REACT_APP_API_HOST || "localhost";
const port = process.env.REACT_APP_API_PORT || "8080";

//set up open api client
const config = new Configuration({
    basePath: `${host}:${port}`,
})

export const apiClient = new DefaultApi(config);

//set up global contexts
export type AuthenticationContextType = {
    sessionId: string;
    username: string;
    loggedIn: boolean;
    login: (s: string, u: string) => void;
    logout: () => void;
}

export type DarkContextType = {
    dark: boolean;
    setDark: (b: boolean) => void
}

let contextValue: AuthenticationContextType = {
    sessionId: "",
    username: "",
    loggedIn: false,
    login: () => {
    },
    logout: () => {
    }
}
let darkValue: DarkContextType = {
    dark: true,
    setDark: () => {
    }
}

export const AuthenticationContext = React.createContext(contextValue)
export const DarkModeContext = React.createContext(darkValue);

function App(this: any) {
    let [authState, setAuthState] = useState(contextValue)
    let [darkState, setDarkState] = useState(darkValue);

    useEffect(() => {
        setDarkState(prev => {
            return {
                ...prev,
                setDark: b => {
                    setDarkState(p => {
                        return {
                            ...p,
                            dark: b
                        }
                    })
                }
            }
        })

        setAuthState(prevState => {
            return {
                ...prevState,
                login: (s: string, u: string) => {
                    setAuthState((prev => {
                        return {
                            ...prev,
                            loggedIn: true,
                            username: u,
                            sessionId: s
                        }
                    }))
                },
                logout: () => {
                    setAuthState((prev) => {
                        return {
                            ...prev,
                            loggedIn: false,
                            username: "",
                            sessionId: ""
                        }
                    })
                }
            }
        })
    }, []);

    return (
        <AuthenticationContext.Provider value={authState}>
            <DarkModeContext.Provider value={darkState}>
                <div className={darkState.dark ? "bp4-dark" : ""} style={darkState.dark ? {backgroundColor: "darkgray", minHeight: "100vh"} : {backgroundColor: "white"}}>
                    <AppHeader/>
                    <Routes>
                        <Route path="/" element={<Startpage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/search" element={<SearchPage/>}/>
                    </Routes>
                </div>
            </DarkModeContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
