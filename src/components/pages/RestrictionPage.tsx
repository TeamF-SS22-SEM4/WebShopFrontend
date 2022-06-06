import React, {useContext} from "react";
import {AuthenticationContext} from "../../App";
import {Link} from "react-router-dom";

interface BaseLayoutProps {
    children?: React.ReactNode;
}

function RestrictionPage({children}: BaseLayoutProps) {
    let authContext = useContext(AuthenticationContext)
    if (!authContext.loggedIn) {
        return (
            <div className="content">
                <div className="container h-100 py-5">
                    <div className="row justify-content-center" style={{"height": "20%"}}>
                        <h4 className="align-self-center text-center">You have to be logged in!</h4>
                    </div>
                </div>
            </div>
        )
        //TODO: back home button fehlt
    }
    return <>{children}</>
}

export default RestrictionPage;