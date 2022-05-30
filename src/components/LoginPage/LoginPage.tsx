import './LoginPage.css'
import {Button, Card, Elevation, FormGroup, InputGroup, Label, Spinner, SpinnerSize} from "@blueprintjs/core";
import {KeyboardEvent, useContext, useEffect, useState} from "react";
import {apiClient, AuthenticationContext} from "../../App";
import {useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';

interface LoginPageProps {
    fromManualLink?: boolean
}

function LoginPage({fromManualLink}: LoginPageProps) {
    const navigate = useNavigate();
    const authenticationContext = useContext(AuthenticationContext);

    let [fetching, setFetching] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [displayEmptyUsernameMsg, setDisplayEmptyUsernameMsg] = useState(false);
    let [displayEmptyPasswordMsg, setDisplayEmptyPasswordMsg] = useState(false)

    let [displayWrongCredentialsMsg, setDisplayWrongCredentialsMsg] = useState(false);
    let [displayGenericErrorMsg, setDisplayGenericErrorMsg] = useState(false);

    const cookie = new Cookies();

    useEffect(() => {                                           //Checks cookie when login-page gets loaded
        if(!authenticationContext.loggedIn){
            let sessionCookie = cookie.get("sessionCookie");

            if (sessionCookie != null && !authenticationContext.loggedIn) {
                const sessionIDAndUser = sessionCookie.split("/");
                let cookieLoginInfo = {sessionId: sessionIDAndUser[0], username: sessionIDAndUser[1], loggedIn: true}; // pass to function as JSON, so it re-renders
                authenticationContext.storeLogin(cookieLoginInfo);
                navigate("/");                                    //navigates back to main page after successful login
            }
        }
    });

    const keyDownListener = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            doLogin();
        }
    }

    const doLogin = () => {
        //cleanup previous state
        setDisplayEmptyUsernameMsg(false);
        setDisplayEmptyPasswordMsg(false);
        setDisplayGenericErrorMsg(false);
        setDisplayWrongCredentialsMsg(false);

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
        const credentials = {username, password};

        apiClient.login({credentials}).then(resultDTO => {
            authenticationContext.storeLogin(resultDTO);

            cookie.set('sessionCookie', resultDTO.sessionId + "/" + resultDTO.username, {maxAge: 3600, path: "/"});

            setFetching(false);
            if (fromManualLink) {
                navigate("/")
            }
        }).catch(response => {
            if (response.status === 403) {
                setDisplayWrongCredentialsMsg(true);
            } else {
                setDisplayGenericErrorMsg(true);
            }
            setFetching(false);
        });
    }

    return (
        <div className={"credential-card-wrapper"}>
            <Card elevation={Elevation.FOUR} className={"credential-card"} >
                {!fetching &&
                    <>
                        {displayWrongCredentialsMsg && <p style={{color: "red", fontSize: 20}}>Wrong Username or Credentials</p>}
                        {displayGenericErrorMsg && <p style={{color: "red", fontSize: 20}}>Something went wrong...</p>}
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