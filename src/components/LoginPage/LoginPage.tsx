import './LoginPage.css'
import {Button, Card, Elevation, FormGroup, InputGroup, Label, Spinner, SpinnerSize} from "@blueprintjs/core";
import {KeyboardEvent, useContext, useState} from "react";
import {AuthenticationContext} from "../../App";
import DestinationPicker from "./DestinationPicker";
import {useNavigate} from "react-router-dom";

export interface Destination {
    address: string
    port: number
}

export const local: Destination = {address: "localhost", port: 1099}
export const remote: Destination = {address: "10.0.40.170", port: 12345}

//TODO maybe proxy adress?

function LoginPage() {
    const navigate = useNavigate();
    const authenticationContext = useContext(AuthenticationContext);
    let [destination, setDestination] = useState(local);
    let [fetching, setFetching] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [displayEmptyUsernameMsg, setDisplayEmptyUsernameMsg] = useState(false);
    let [displayEmptyPasswordMsg, setDisplayEmptyPasswordMsg] = useState(false)

    const keyDownListener = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            doLogin();
        }
    }
    const doLogin = () => {
        //cleanup previous state
        setDisplayEmptyUsernameMsg(false);
        setDisplayEmptyPasswordMsg(false);


        if (!username) {
            setDisplayEmptyUsernameMsg(true)
        }
        if (!password) {
            setDisplayEmptyPasswordMsg(true);
        }
        if (!username || !password) {
            return
        }

        setFetching(true)
        setTimeout(() => {
            //TODO call actual api
            authenticationContext.login("placeholder-session", "test-user");
            navigate("/")
            setFetching(false)
        }, 500);
    }

    return (
        <div className={"credential-card-wrapper"}>
            <Card elevation={Elevation.FOUR} className={"credential-card"} >
                {!fetching &&
                    <>
                    <DestinationPicker dest={destination} setDest={setDestination}/>
                    <FormGroup className={"credential-form"}>
                    <Label htmlFor={"username-input"} className={ displayEmptyUsernameMsg ? "error-msg": ""}>{!displayEmptyUsernameMsg ? "Username" : "Empty Username!"}</Label>
                    <InputGroup id={"username-input"} className={ displayEmptyUsernameMsg ? "error-msg": ""} value={username} onInput={e => setUsername((e.target as HTMLInputElement).value)} placeholder={"username"}  onKeyPress={event => keyDownListener(event)}/>

                    <Label htmlFor={"password-input"} className={ displayEmptyPasswordMsg ? "error-msg": ""}>{!displayEmptyPasswordMsg ? "Password" : "Empty Password!"}</Label>
                    <InputGroup id={"password-input"}  className={ displayEmptyPasswordMsg ? "error-msg": ""} type={"password"} value={password} onInput={e => setPassword((e.target as HTMLInputElement).value)} placeholder={"password"} onKeyPress={event => keyDownListener(event)}/>
                    </FormGroup>
                    <Button intent="success" text={"Login"} onClick={() => doLogin()}/>
                    </>
                }
                {fetching &&
                    <div className={"spinner-wrapper"}>
                        <h3>Logging you in</h3>
                        <Spinner size={SpinnerSize.LARGE}/>

                    </div>
                }
            </Card>
        </div>
    )

}

export default LoginPage;