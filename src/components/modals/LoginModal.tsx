import React, {useContext, useState} from "react";
import {apiClient, AuthenticationContext} from "../../App";
import Cookies from "universal-cookie";
import {FaLock, FaUserAlt} from "react-icons/fa";

interface ProductDetailsPopupProps {
    callbackFunction: () => void;
}

const LoginModal = ({callbackFunction}: ProductDetailsPopupProps) => {

    const authenticationContext = useContext(AuthenticationContext);
    const cookie = new Cookies();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayErrorMsg, setDisplayErrorMsg] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("Error");

    function doLogin() {
        setIsLoading(true);
        setDisplayErrorMsg(false);

        if (!username || !password) {
            setErrorMsg("Empty username or password!");
            setIsLoading(false);
            setDisplayErrorMsg(true);
        } else {
            const credentials = {username, password};
            apiClient.login({credentials}).then(resultDTO => {
                setUsername("");
                setPassword("");
                authenticationContext.storeLogin(resultDTO);
                cookie.set('sessionCookie', resultDTO.sessionId + "/" + resultDTO.username, {maxAge: 3600, path: "/"});
                callbackFunction();
            }).catch(response => {
                if (response.status === 403) {
                    setErrorMsg("Invalid username or password!");
                    setIsLoading(false);
                    setDisplayErrorMsg(true);
                } else {
                    setErrorMsg("Something went wrong!");
                    setIsLoading(false);
                    setDisplayErrorMsg(true);
                }
            });
        }
    }

    return (
        <div className='modal-outer'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button className="btn btn-p btn-sm" onClick={() => callbackFunction()}>close</button>
                    </div>
                    <div className="modal-body">
                        <p className={displayErrorMsg ? "col text-center error fw-bolder py-2" : "col text-center error fw-bolder py-2 invisible"}>{errorMsg}</p>
                        <div className="input-group align-items-center w-50 m-auto pb-2">
                            <FaUserAlt className="me-3"></FaUserAlt>
                            <input className="form-control login-input" type="text" placeholder="username"
                                   onInput={e => setUsername((e.target as HTMLInputElement).value)}/>
                        </div>
                        <div className="input-group align-items-center w-50 m-auto pb-3">
                            <FaLock className="me-3"></FaLock>
                            <input className="form-control login-input" type="password" placeholder="password"
                                   onInput={e => setPassword((e.target as HTMLInputElement).value)}
                                   onKeyDown={e => e.key === 'Enter' && doLogin()}/>
                        </div>
                        <button className="btn btn-p w-25 m-auto d-flex justify-content-center my-4" onClick={() => doLogin()}>
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

export default LoginModal;