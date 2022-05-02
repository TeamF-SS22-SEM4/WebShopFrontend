import React, {useContext} from 'react';
import "./AccountIcon.css";
import {Button, Popover} from "@blueprintjs/core";
import AccountDropdown from "./AccountDropdown";
import {Link} from "react-router-dom";
import {AuthenticationContext} from "../../App";

function AccountIcon() {
    const authenticationContext = useContext(AuthenticationContext)

    //TODO global state for loggedin with username, sessionid...
    let loggedIn = authenticationContext.loggedIn;

    return (
        <div className={"accountIcon"}>
            {!loggedIn && <Link to={"/login"}> <Button large={true}> Login </Button> </Link>}
            {loggedIn &&
                <Popover content={<AccountDropdown/>}>
                    <Button large={true}>
                        Account
                    </Button>
                </Popover>
            }
        </div>
    )
}
export default AccountIcon;