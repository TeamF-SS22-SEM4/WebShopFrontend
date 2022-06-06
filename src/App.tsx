import React, {useContext, useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import HomePage from "./components/pages/HomePage";
import {Configuration, DefaultApi, LoginResultDTO} from "./openapi-client";
import CartPage from './components/pages/CartPage';
import Header from "./components/others/Header";

import 'normalize.css/normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css';
import PlaylistPage from "./components/PlaylistPage/PlaylistPage";
import RestrictionPage from "./components/pages/RestrictionPage";
import PurchasesPage from "./components/pages/PurchasesPage";

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

    let [theme, setTheme] = useState<ThemeType>("mode-dark mode-orange");

    return (
        <AuthenticationContext.Provider value={authState}>
            <ShoppingCartContext.Provider value={shoppingCartState}>
                <ThemeContext.Provider value={[theme, setTheme]}>
                    <div className={theme}>
                        <Header />
                        <Routes>
                            <Route index element={<HomePage/>}/>
                            <Route path="/cart" element={ <CartPage/>}/>
                            <Route path="/playlist" element={
                                <RestrictionPage>
                                    <PlaylistPage/>
                                </RestrictionPage>
                            }/>
                            <Route path="/purchases" element={
                                <RestrictionPage>
                                    <PurchasesPage/>
                                </RestrictionPage>
                            }/>
                        </Routes>
                    </div>
                </ThemeContext.Provider>

            </ShoppingCartContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
