import React, {useContext, useEffect, useState} from "react";
import {apiClient, AuthenticationContext} from "../../App";
import Cookies from "universal-cookie";
import {FaLock, FaUserAlt} from "react-icons/fa";

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
}

const LoginPopup = ({callbackFunction}: ProductDetailsPopupProps) => {
    const authenticationContext = useContext(AuthenticationContext);
    const cookie = new Cookies();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    let [isLoading, setIsLoading] = useState<boolean>(false);
    let [displayErrorMsg, setDisplayErrorMsg] = useState<boolean>(false);
    let [errorMsg, setErrorMsg] = useState<string>("Error");

    function doLogin() {
        setIsLoading(true);
        setDisplayErrorMsg(false);

        if (!username || !password) {
            setErrorMsg("Empty username or password!");
            setDisplayErrorMsg(true);
            setIsLoading(false);
        } else {
            const credentials = {username, password};
            apiClient.login({credentials}).then(resultDTO => {
                setUsername("");
                setPassword("")
                authenticationContext.storeLogin(resultDTO);
                cookie.set('sessionCookie', resultDTO.sessionId + "/" + resultDTO.username, {maxAge: 600, path: "/"});
                callbackFunction();
            }).catch(response => {
                if (response.status === 403) {
                    setErrorMsg("Invalid username or password!");
                    setDisplayErrorMsg(true);
                    setIsLoading(false);
                } else {
                    setErrorMsg("Something went wrong ...!");
                    setDisplayErrorMsg(true);
                    setIsLoading(false);
                }
            });
        }
    }

    useEffect(() => {                                           //Checks cookie when login-page gets loaded
        if (!authenticationContext.loggedIn) {
            let sessionCookie = cookie.get("sessionCookie");

            if (sessionCookie != null && !authenticationContext.loggedIn) {
                const sessionIDAndUser = sessionCookie.split("/");
                let cookieLoginInfo = {sessionId: sessionIDAndUser[0], username: sessionIDAndUser[1], loggedIn: true}; // pass to function as JSON, so it re-renders
                authenticationContext.storeLogin(cookieLoginInfo);
            }
        }
    });


    return (
        <div className='modal-outer'>
            <div className="modal-dialog" style={{"maxWidth": "400px"}}>
                <div className="modal-content">
                    <div className="modal-header p-3">
                        <h5 className="modal-title" id="exampleModalLabel">Login</h5>
                        <button className="btn btn-primary btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        <p className={displayErrorMsg ? "col text-center error fw-bolder" : "col text-center error fw-bolder invisible"}>{errorMsg}</p>
                        <div className="input-group align-items-center w-75 m-auto pb-2">
                            <FaUserAlt className="me-3"></FaUserAlt>
                            <input className="form-control login-input" type="text" placeholder="username"
                                   onInput={e => setUsername((e.target as HTMLInputElement).value)}/>
                        </div>
                        <div className="input-group align-items-center w-75 m-auto pb-3">
                            <FaLock className="me-3"></FaLock>
                            <input className="form-control login-input" type="password" placeholder="password"
                                   onInput={e => setPassword((e.target as HTMLInputElement).value)}
                                   onKeyDown={e => e.key === 'Enter' && doLogin()}/>
                        </div>
                        <button className="btn btn-primary w-50 m-auto d-flex justify-content-center my-4" onClick={() => doLogin()}>
                            {!isLoading ?
                                <>Login</>
                            :
                                <>&nbsp;<div className="spinner-border spinner-border-sm text-white align-self-center"></div>&nbsp;</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPopup;