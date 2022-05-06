import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import LoginPage from "./LoginPage";

interface BaseLayoutProps {
    children?: React.ReactNode;
}

function RestrictedWrapper({children}: BaseLayoutProps) {
    let authContext = useContext(AuthenticationContext)
    if (!authContext.loggedIn) {
        return <LoginPage/>;
    }
    return <>{children}</>
}

export default RestrictedWrapper;