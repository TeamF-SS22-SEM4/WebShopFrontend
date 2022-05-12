import React, {useContext} from "react";
import {AuthenticationContext} from "../App";
import {Link} from "react-router-dom";
import {Card, Elevation, Icon, MenuItem} from "@blueprintjs/core";
import SearchButton from "./StartPage/SearchButton";

function AccountIcon() {
    const authenticationContext = useContext(AuthenticationContext)
    let loggedIn = authenticationContext.loggedIn;

    return (
        <div className={"accountIcon"}>
            {   !loggedIn
                &&
                <Link to={"/login"}>
                        <span style={{color: "white"}}> Loginnn </span>
                </Link>}


            {loggedIn && <MenuItem onClick={() => authenticationContext.logout()} text={<><Icon icon={"log-out"}/> <span>Log out</span> </>}/> }

        </div>
    )
}

const Header = () => {
    return (
        <div className="header d-flex">

            <div className="container d-flex align-items-center justify-content-between">
                <Link to={"/"} className="header-logo" />

                <div className=" text-end">
                    <ul className="nav nav-pills">
                        <li>
                            <a href="/search" className="nav-link text-white">
                                <span className="nav-value">Shop</span>
                            </a>
                        </li>
                        <li>
                            <a href="/cart" className="nav-link text-white">
                                <span className="nav-value">Shoppingcart</span>
                            </a>
                        </li>
                        <li>
                            <a href="/restrictedTest" className="nav-link text-white">
                                <span className="nav-value">Test</span>
                            </a>
                        </li>
                        <li>
                            <AccountIcon/>
                        </li>
                    </ul>
                </div>

            </div>


        </div>
    );
}

export default Header;