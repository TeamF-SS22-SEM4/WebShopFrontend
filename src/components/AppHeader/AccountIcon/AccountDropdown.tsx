import {MenuItem, Menu, Icon} from "@blueprintjs/core";
import {useContext} from "react";
import {AuthenticationContext, useDarkModeContext} from "../../../App";

function AccountDropdown() {
    const authenticationContext = useContext(AuthenticationContext);
    const [isDark, setDarkContext] = useDarkModeContext();
    let loggedIn = authenticationContext.loggedIn;

    return (
        <Menu>
            <MenuItem text={"Theme"}>
                <MenuItem selected={isDark} text={<>
                        <Icon icon={"moon"} /> <span>Dark</span>
                    </>
                } onClick={() => setDarkContext(true)}/>
                <MenuItem selected={!isDark} text={<>
                    <Icon icon={"flash"} /> <span>Light</span>
                </>
                } onClick={() => setDarkContext(false)}/>
            </MenuItem>
            {loggedIn && <MenuItem onClick={() => authenticationContext.logout()} text={<><Icon icon={"log-out"}/> <span>Log out</span> </>}/> }
        </Menu>
    )
}

export default AccountDropdown;