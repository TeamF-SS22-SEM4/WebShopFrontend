import React, {useContext} from "react";
import {AuthenticationContext, ShoppingCartContext} from "../../App";
import {Link} from "react-router-dom";
import {FaHome, FaShoppingCart, FaUserAlt} from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BsBox } from "react-icons/bs";

const Header = () => {

    const authenticationContext = useContext(AuthenticationContext);
    let loggedIn = authenticationContext.loggedIn;
    let username = authenticationContext.username;

    const shoppingCartContext = useContext(ShoppingCartContext);

    return (
        <div className="header d-flex">
            <div className="container d-flex align-items-center justify-content-between">
                <Link to={"/"} className="header-logo" />
                <ul className="nav">
                    <li className="m-2">
                        <Link to={"/"} className="position-relative nav-link text-white">
                            <FaHome size={20}></FaHome>
                            &nbsp;&nbsp;&nbsp;Home
                        </Link>
                    </li>
                    <li className="m-2">
                        <Link to={"/cart"} className="position-relative nav-link text-white">
                            <FaShoppingCart size={18}></FaShoppingCart>
                            &nbsp;&nbsp;&nbsp;Cart
                            {shoppingCartContext.items === 0 ?
                                <span />
                            :
                                <span key={shoppingCartContext.items} className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger testtt">{shoppingCartContext.items}</span>
                            }
                        </Link>
                    </li>
                    <li className="m-2">
                        {!loggedIn ?
                            <Link to={"/login"} className="nav-link text-white">
                                <FiLogIn size={20}></FiLogIn>
                                &nbsp;&nbsp;&nbsp;Login
                            </Link>
                        :
                            <div className="dropdown">
                                <a className="dropdown-toggle nav-link text-white">
                                    <FaUserAlt size={18}></FaUserAlt>
                                    &nbsp;&nbsp;&nbsp;{username}
                                </a>
                                <ul className="dropdown-menu">
                                    <div className="pt-1 pb-2 px-2 dropdown-menu-custom">
                                        <li><a className="dropdown-item" href="src/components/others/Header#">
                                            <BsBox size={15}></BsBox>
                                            &nbsp;&nbsp;&nbsp;My Orders</a></li>
                                        <li>
                                            <a onClick={() => authenticationContext.logout()} className="dropdown-item" href="src/components/others/Header#">
                                                <FiLogOut size={15}></FiLogOut>
                                                &nbsp;&nbsp;&nbsp;Logout
                                            </a>
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        }
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;