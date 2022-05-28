import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import Login from "../pages/Login";

interface BaseLayoutProps {
    children?: React.ReactNode;
}

function RestrictedWrapper({children}: BaseLayoutProps) {
    let authContext = useContext(AuthenticationContext)
    if (!authContext.loggedIn) {
        return <Login/>;
    }
    return <>{children}</>
}

export default RestrictedWrapper;