import React, {KeyboardEvent, useContext, useState} from "react";
import {apiClient, AuthenticationContext} from "../App";
import {useNavigate} from "react-router-dom";

interface LoginPageProps {
    fromManualLink?: boolean
}

function LoginPage({fromManualLink}: LoginPageProps) {
    const navigate = useNavigate();
    const authenticationContext = useContext(AuthenticationContext);
    let [fetching, setFetching] = useState(false);
    let [username, setUsername] = useState("jst2559");
    let [password, setPassword] = useState("password");

    let [displayEmptyUsernameMsg, setDisplayEmptyUsernameMsg] = useState(false);
    let [displayEmptyPasswordMsg, setDisplayEmptyPasswordMsg] = useState(false)

    let [displayWrongCredentialsMsg, setDisplayWrongCredentialsMsg] = useState(false);
    let [displayGenericErrorMsg, setDisplayGenericErrorMsg] = useState(false);

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
                <div className="test d-inline">

                    <p>Feedback</p>
                    {displayWrongCredentialsMsg && <p style={{color: "red", fontSize: 20}}>Wrong Username or Credentials</p>}
                    {displayGenericErrorMsg && <p style={{color: "red", fontSize: 20}}>Something went wrong...</p>}
                    {displayEmptyPasswordMsg && <p style={{color: "red", fontSize: 20}}>Something went wrong...</p>}

                    <form className="w-25 m-5">
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onInput={e => setUsername((e.target as HTMLInputElement).value)} />
                            <div className="form-text text-danger">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onInput={e => setPassword((e.target as HTMLInputElement).value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
                        </div>
                        <button onClick={() => doLogin()} className="btn btn-lg btn-primary w-100 d-flex justify-content-center">
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
                    </form>
                </div>
            </div>
        </div>
    )

}

export default LoginPage;