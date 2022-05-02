import {Button} from "@blueprintjs/core";
import {useContext} from "react";
import {AuthenticationContext} from "../App";

function LoginPage() {
    const authenticationContext = useContext(AuthenticationContext)

    return (
        <div>
            <p>this is a login page</p>
            <Button intent="success" text={"login"} onClick={event => authenticationContext.login("121414", "lukas")}></Button>
        </div>
    )

}

export default LoginPage;