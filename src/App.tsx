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
import CheckoutPage from './components/CheckoutPage/CheckoutPage';
import Header from "./components/Header";

const host = process.env.REACT_APP_API_HOST || "localhost";
const port = process.env.REACT_APP_API_PORT || "8080";
const protocol = process.env.REACT_APP_API_PROTOCOL || "http";

//set up open api client
const configParams = {
    //https?
    basePath: `${protocol}://${host}:${port}`
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
            {/*<Header />*/}
            <AppHeader/>
            <Routes>
                <Route index element={<Startpage/>}/>
                <Route path="/login" element={<LoginPage fromManualLink={true}/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/cart" element={ <ShoppingCartPage/>}/>
                <Route path="/checkout" element={
                    <RestrictedWrapper>
                        <CheckoutPage />
                    </RestrictedWrapper>
                }/>
                <Route path="/restrictedTest" element={
                    <RestrictedWrapper>
                        <h1>If you see this without being logged in tell Lukas he fucked up.</h1>
                    </RestrictedWrapper>
                }/>
            </Routes>
        </AuthenticationContext.Provider>
    );
}

export default App;
