import "./AccountIcon.css"
import {Button, Popover} from "@blueprintjs/core";
import AccountDropdown from "./AccountDropdown";
import {Link} from "react-router-dom";

function AccountIcon() {

    //TODO global state for loggedin with username, sessionid...
    let loggedIn = false;

    return (
        <div className={"accountIcon"}>
            {!loggedIn && <Button large={true}> <Link to={"/login"} >Login</Link> </Button>}
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