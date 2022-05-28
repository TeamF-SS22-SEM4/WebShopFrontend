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
import ShoppingCartPage from './components/ShoppingCartPage/ShoppingCartPage';
import RestrictedWrapper from "./components/LoginPage/RestrictedWrapper";
import PlaylistPage from "./components/PlaylistPage/PlaylistPage";

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

let contextValue: AuthenticationContextType = {
    sessionId: "",
    username: "",
    loggedIn: false,
    storeLogin: () => {
    },
    logout: () => {
    }
}

type DarkModeType = boolean | undefined;

type DarkModeContextType = [
    DarkModeType,
    React.Dispatch<React.SetStateAction<DarkModeType>>
];

const DarkModeContext = React.createContext<DarkModeContextType | undefined>(undefined);
export const useDarkModeContext = () => useContext(DarkModeContext) as DarkModeContextType;


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


function App(this: any) {
    let [authState, setAuthState] = useState(contextValue)
    let [darkState, setDarkState] = useState(darkValue);
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

    let darkStateArr = useState<DarkModeType>(true);
    let isDark = darkStateArr[0]; //needed because value of the state is also read in the same component that provides the context

    return (
        <AuthenticationContext.Provider value={authState}>
            <ShoppingCartContext.Provider value={shoppingCartState}>
            <Header />
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/login" element={<LoginPage fromManualLink={true}/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/cart" element={ <ShoppingCartPage/>}/>
                <Route path="/playlist" element={
                    <RestrictedWrapper>
                        <PlaylistPage/>
                    </RestrictedWrapper>
                }/>
            </Routes>
            </ShoppingCartContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
