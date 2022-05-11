import React, {useEffect, useState} from 'react';
import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import LoginPage from './components/LoginPage/LoginPage';
import {Route, Routes} from 'react-router-dom';
import Startpage from "./components/StartPage/Startpage";
import SearchPage from "./components/SearchPage/SearchPage";
import {Configuration, DefaultApi, LoginResultDTO} from "./openapi-client";
import RestrictedWrapper from "./components/LoginPage/RestrictedWrapper";
import ShoppingCartPage from './components/ShoppingCartPage/ShoppingCartPage';

//set up open api client
const apiUrl = window.location.origin === "http://localhost:3000" ? "http://localhost:8080" : window.location.origin;
const configParams = {
    basePath: apiUrl
}
export let apiClient = new DefaultApi(new Configuration(configParams));
const setSessionIdInClient = (token: string) => {
    apiClient = new DefaultApi(new Configuration(
        {...configParams,
        headers: {"session-id": token}}
        //TODO change to http-auth header
    ))
}

//set up global contexts
export type AuthenticationContextType = {
    sessionId: string;
    username: string;
    loggedIn: boolean;
    storeLogin: (dto: LoginResultDTO) => void;
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
    storeLogin: () => {
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
                storeLogin: (dto) => {
                    setAuthState((prev => {
                        setSessionIdInClient(dto.sessionId || "")
                        return {
                            ...prev,
                            loggedIn: true,
                            username: dto.username || "",
                            sessionId: dto.sessionId || ""
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
                <div className={darkState.dark ? "bp4-dark" : ""} style={darkState.dark ? {backgroundColor: "#616161", minHeight: "100vh"} : {backgroundColor: "white"}}>
                    <AppHeader/>
                    <Routes>
                        <Route index element={<Startpage/>}/>
                        <Route path="/login" element={<LoginPage fromManualLink={true}/>}/>
                        <Route path="/search" element={<SearchPage/>}/>
                        <Route path="/cart" element={ <ShoppingCartPage/>}/>
                        <Route path="/restrictedTest" element={
                            <RestrictedWrapper>
                                <h1>If you see this without being logged in tell Lukas he fucked up.</h1>
                            </RestrictedWrapper>
                        }/>
                    </Routes>
                </div>
            </DarkModeContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
