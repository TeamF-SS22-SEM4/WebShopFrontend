import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import Home from "../pages/Home";

interface BaseLayoutProps {
    children?: React.ReactNode;
}

function RestrictedWrapper({children}: BaseLayoutProps) {
    let authContext = useContext(AuthenticationContext)
    if (!authContext.loggedIn) {
        return <Home/>;
    }
    return <>{children}</>
}

export default RestrictedWrapper;