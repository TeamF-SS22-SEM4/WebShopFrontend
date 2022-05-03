import React, {useContext} from 'react';
import "./AccountIcon.css";
import {Button, Icon, Popover} from "@blueprintjs/core";
import AccountDropdown from "./AccountDropdown";
import {Link} from "react-router-dom";
import {AuthenticationContext} from "../../App";

function AccountIcon() {
    const authenticationContext = useContext(AuthenticationContext)
    let loggedIn = authenticationContext.loggedIn;

    return (
        <div className={"accountIcon"}>
            {!loggedIn && <Link to={"/login"}> <Button large={true} minimal={true}>
                <Icon icon={"log-in"} size={20} className={"login-icon"} /><span style={{color: "white"}}> Login </span> </Button> </Link>}
            <Popover content={<AccountDropdown/>}>
                <div className={"profile-wrapper"}>
                    <Button minimal={true}>
                        <Icon icon={"cog"} size={40}/>
                    </Button>
                </div>
            </Popover>
        </div>
    )
}
export default AccountIcon;