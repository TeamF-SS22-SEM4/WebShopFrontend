import {MenuItem, Menu, Icon} from "@blueprintjs/core";
import {useContext} from "react";
import {AuthenticationContext, DarkModeContext} from "../../../App";
import Cookie from "universal-cookie";

function AccountDropdown() {
    const authenticationContext = useContext(AuthenticationContext)
    const darkContext = useContext(DarkModeContext)
    let loggedIn = authenticationContext.loggedIn;

    return (
        <Menu>
            <MenuItem text={"Theme"}>
                <MenuItem selected={darkContext.dark} text={<>
                        <Icon icon={"moon"} /> <span>Dark</span>
                    </>
                } onClick={() => darkContext.setDark(true)}/>
                <MenuItem selected={!darkContext.dark} text={<>
                    <Icon icon={"flash"} /> <span>Light</span>
                </>
                } onClick={() => darkContext.setDark(false)}/>
            </MenuItem>
            {loggedIn && <MenuItem onClick={() => {
                const cookie = new Cookie();
                cookie.remove("sessionCookie", {path:"/"});

                authenticationContext.logout()}}
                text={<><Icon icon={"log-out"}/> <span>Log out</span> </>}/> }
        </Menu>
    )
}

export default AccountDropdown;