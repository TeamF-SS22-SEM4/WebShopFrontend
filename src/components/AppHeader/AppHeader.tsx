import {Link} from "react-router-dom";
import logo from "../../resources/icon.png"
import './AppHeader.css'
import AccountIcon from "./AccountIcon/AccountIcon";

function AppHeader() {
  return (
    <div className="app-header">
        <div>
            <Link to={"/"}>
                <img src={logo} className={"logo"} alt={"tomify-logo"}/>
            </Link>
        </div>

        <AccountIcon/>

    </div>
  );
}

export default AppHeader;
