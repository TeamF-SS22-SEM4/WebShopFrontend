import React, {useEffect, useState} from 'react';
import Login from './components/pages/Login';
import {Route, Routes} from 'react-router-dom';
import Home from "./components/pages/Home";
import {Configuration, DefaultApi, LoginResultDTO} from "./openapi-client";
import Cart from './components/pages/Cart';
import Header from "./components/others/Header";

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css';

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

type ShoppingCartContextType = {
    items: number,
    setItems: (i: number) => void
}



let shoppingCartContext: ShoppingCartContextType = {
    items: 0,
    setItems: () => {}
}

export const ShoppingCartContext = React.createContext(shoppingCartContext);


function App(this: any) {
    let [authState, setAuthState] = useState(contextValue)
    let [darkState, setDarkState] = useState(darkValue);
    let [shoppingCartState, setShoppingCartState] = useState(shoppingCartContext);

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

        setShoppingCartState(prevState => {
            return {
                ...prevState,
                setItems: (i: number) => {
                    setShoppingCartState((prev => {
                        return {
                            ...prev,
                            items: i
                        }
                    }))
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
            <ShoppingCartContext.Provider value={shoppingCartState}>
            <Header />
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/login" element={<Login fromManualLink={true}/>}/>
                <Route path="/cart" element={ <Cart/>}/>
            </Routes>
            </ShoppingCartContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
