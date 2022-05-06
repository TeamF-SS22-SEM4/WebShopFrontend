import React, { useContext } from 'react';
import {Link} from "react-router-dom";
import logo from "../../resources/icon.png"
import './AppHeader.css'
import AccountIcon from "./AccountIcon/AccountIcon";
import { AuthenticationContext } from '../../App';

function AppHeader() {
  const authenticationContext = useContext(AuthenticationContext)
  let loggedIn = authenticationContext.loggedIn;

  return (
    <div className="app-header">
        <div>
            <Link to={"/"}>
                <img src={logo} className={"logo"} alt={"tomify-logo"}/>
            </Link>
        </div>

        {
          loggedIn && 
          <Link to={"/cart"}>
            Shopping Cart
          </Link>
        }

        <AccountIcon/>

    </div>
  );
}

export default AppHeader;
