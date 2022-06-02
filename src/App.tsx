import React, {useContext, useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from "./components/pages/Home";
import {Configuration, DefaultApi, LoginResultDTO} from "./openapi-client";
import Cart from './components/pages/Cart';
import Header from "./components/others/Header";

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css';
import PlaylistPage from "./components/PlaylistPage/PlaylistPage";
import RestrictedWrapper from "./components/others/RestrictedWrapper";
import Orders from "./components/pages/Orders";

//set up open api client
const apiUrl = window.location.origin === "http://localhost:3000" ? "http://localhost:80" : window.location.origin;
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

let contextValue: AuthenticationContextType = {
    sessionId: "",
    username: "",
    loggedIn: false,
    storeLogin: () => {
    },
    logout: () => {
    }
}

export const AuthenticationContext = React.createContext(contextValue)

type ShoppingCartContextType = {
    items: number,
    setItems: (i: number) => void
}



let shoppingCartContext: ShoppingCartContextType = {
    items: 0,
    setItems: () => {}
}

export const ShoppingCartContext = React.createContext(shoppingCartContext);


type ThemeType = string | undefined;

type ThemeContextType = [
    ThemeType,
    React.Dispatch<React.SetStateAction<ThemeType>>
]

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
export const useThemeContext = () => useContext(ThemeContext) as ThemeContextType;



function App(this: any) {
    let [authState, setAuthState] = useState(contextValue)
    let [shoppingCartState, setShoppingCartState] = useState(shoppingCartContext);

    useEffect(() => {

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

    let [theme, setTheme] = useState<ThemeType>("mode-dark");

    return (
        <AuthenticationContext.Provider value={authState}>
            <ShoppingCartContext.Provider value={shoppingCartState}>
                <ThemeContext.Provider value={[theme, setTheme]}>
                    <div className={theme}>
                        <Header />
                        <Routes>
                            <Route index element={<Home/>}/>
                            <Route path="/cart" element={ <Cart/>}/>
                            <Route path="/playlist" element={
                                <RestrictedWrapper>
                                    <PlaylistPage/>
                                </RestrictedWrapper>
                            }/>
                            <Route path="/orders" element={
                                <RestrictedWrapper>
                                    <Orders/>
                                </RestrictedWrapper>
                            }/>
                        </Routes>
                    </div>
                </ThemeContext.Provider>

            </ShoppingCartContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
