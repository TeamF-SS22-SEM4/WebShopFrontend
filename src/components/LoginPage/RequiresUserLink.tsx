import React, {FunctionComponent, useContext} from "react";
import {AuthenticationContext} from "../../App";
import {Link} from "react-router-dom";

interface BaseLayoutProps {
    to: string,
    children?: React.ReactNode;
}

const RequiresUserLink: FunctionComponent<BaseLayoutProps> = ({to, children}) => {

    const authenticationContext = useContext(AuthenticationContext);

    return (
        <Link to={authenticationContext.loggedIn ? to : "/login"}>
            {children}
        </Link>
    )

}

export default RequiresUserLink;