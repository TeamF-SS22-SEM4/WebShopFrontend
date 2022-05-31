import {Link, useNavigate} from "react-router-dom";
import logo from "../../resources/icon.png"
import './AppHeader.css'
import AccountIcon from "./AccountIcon/AccountIcon";
import Cookies from "universal-cookie"
import {useContext, useEffect} from "react";
import {AuthenticationContext} from "../../App";

function AppHeader() {
    const navigate = useNavigate();
    const authenticationContext = useContext(AuthenticationContext);

    useEffect(() => {
        const cookie = new Cookies();

        if(!authenticationContext.loggedIn){
            let sessionCookie = cookie.get("sessionCookie");

            if (sessionCookie != null) {
                const sessionIDAndUser = sessionCookie.split("/");
                let cookieLoginInfo = {sessionId: sessionIDAndUser[0], username: sessionIDAndUser[1], loggedIn: true}; // pass to function as JSON, so it re-renders
                authenticationContext.storeLogin(cookieLoginInfo);
                navigate("/");                                    //navigates back to main page after successful login
            }
        }
    })

    return (
    <div className="app-header">
        <div>
            <Link to={"/"}>
                <img src={logo} className={"logo"} alt={"tomify-logo"}/>
            </Link>
        </div>

        <AccountIcon/>

    </div>
  );
}

export default AppHeader;
