import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import LoginPage from './components/LoginPage/LoginPage';
import {Route, Routes} from 'react-router-dom';
import Startpage from "./components/StartPage/Startpage";
import SearchPage from "./components/SearchPage/SearchPage";
import {Configuration, DefaultApi, LoginResultDTO} from "./openapi-client";
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

function App() {
    let [authState, setAuthState] = useState(contextValue)

    useEffect(() => {

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
            <DarkModeContext.Provider value={darkStateArr}>
                <div className={isDark ? "bp4-dark" : ""} style={isDark ? {backgroundColor: "#616161", minHeight: "100vh"} : {backgroundColor: "white"}}>
                    <AppHeader/>
                    <Routes>
                        <Route index element={<Startpage/>}/>
                        <Route path="/login" element={<LoginPage fromManualLink={true}/>}/>
                        <Route path="/search" element={<SearchPage/>}/>
                        <Route path="/cart" element={ <ShoppingCartPage/>}/>
                        <Route path="/playlist" element={
                            // <RestrictedWrapper> TODO uncomment
                                <PlaylistPage/>
                            // </RestrictedWrapper>
                        }/>
                    </Routes>
                </div>
            </DarkModeContext.Provider>
        </AuthenticationContext.Provider>
    );
}

export default App;
