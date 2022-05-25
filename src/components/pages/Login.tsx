import React, {KeyboardEvent, useContext, useState} from "react";
import {apiClient, AuthenticationContext} from "../../App";
import {useNavigate} from "react-router-dom";
import {FaLock, FaUserAlt} from "react-icons/fa";

interface LoginPageProps {
    fromManualLink?: boolean
}

function Login({fromManualLink}: LoginPageProps) {
    const navigate = useNavigate();
    const authenticationContext = useContext(AuthenticationContext);
    let [fetching, setFetching] = useState(false);
    let [displayEmptyUsernameMsg, setDisplayEmptyUsernameMsg] = useState(false);
    let [displayEmptyPasswordMsg, setDisplayEmptyPasswordMsg] = useState(false)

    let [displayWrongCredentialsMsg, setDisplayWrongCredentialsMsg] = useState(false);
    let [displayGenericErrorMsg, setDisplayGenericErrorMsg] = useState(false);


    //TODO: remove values!!!
    let username = "jst2559";
    let password = "password";


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
        <div className="content">
            <div className="container">
                    {displayWrongCredentialsMsg && <p style={{color: "red", fontSize: 20}}>Wrong Username or Password</p>}
                    {displayGenericErrorMsg && <p style={{color: "red", fontSize: 20}}>Something went wrong...</p>}
                    <form>
                        <div className="input-group align-items-center">
                            <FaUserAlt className="me-2"></FaUserAlt>
                            <input className="form-control login-input" type="text" placeholder="username" onInput={e => username = ((e.target as HTMLInputElement).value)} />
                        </div>
                        <div className="input-group align-items-center">
                            <FaLock className="me-2"></FaLock>
                            <input className="form-control login-input" type="password" placeholder="password" onInput={e => password = ((e.target as HTMLInputElement).value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />

                        </div>
                    </form>

                    <button className="btn btn-lg btn-primary w-100 d-flex justify-content-center" onClick={() => doLogin()}>
                        {!fetching ?
                            <>
                                <div className="spinner-border text-white invisible"></div>
                                Login
                                <div className="spinner-border text-white invisible"></div>
                            </>
                            :
                            <div className="spinner-border text-white"></div>
                        }
                    </button>

            </div>
        </div>
    )
}

export default Login;
