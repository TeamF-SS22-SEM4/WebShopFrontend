import React from 'react';
import {Link} from "react-router-dom";
import logo from "../../icon.png"
import './AppHeader.css'
import AccountIcon from "../AccountIcon/AccountIcon";

function AppHeader() {
  return (
    <div className="app-header">
        <div>
            <Link to={"/"}>
                <img src={logo} className={"logo"}/>
            </Link>
        </div>

        <AccountIcon></AccountIcon>

    </div>
  );
}

export default AppHeader;
