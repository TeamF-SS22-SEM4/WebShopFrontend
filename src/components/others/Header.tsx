import React, {useContext, useEffect, useState} from "react";
import {AuthenticationContext, ShoppingCartContext} from "../../App";
import {Link} from "react-router-dom";
import {FaHome, FaShoppingCart, FaUserAlt} from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import LoginPopup from "../modals/LoginModal";

const Header = () => {

    const authenticationContext = useContext(AuthenticationContext);
    const shoppingCartContext = useContext(ShoppingCartContext);

    const isLoggedIn = authenticationContext.loggedIn;
    const username = authenticationContext.username;
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false);

    useEffect(() => {
        function closeByEsc(e: any) {
            if(e.key === 'Escape'){
                closeLoginModal();
            }
        }

        function closeByOutsideClick(event: any) {
            if (!event.target.closest(".modal-dialog") && event.target.closest(".modal-outer")) {
                closeLoginModal();
            }
        }

        window.addEventListener('keydown', closeByEsc);
        window.addEventListener('click', closeByOutsideClick);

        return () => {
            window.addEventListener('keydown', closeByEsc);
            window.addEventListener('click', closeByOutsideClick);
        }
    }, []);

    function showLoginModal() {
        setDisplayLoginModal(true);
    }

    function closeLoginModal() {
        setDisplayLoginModal(false);
    }

    return (
        <div className="header d-flex">
            <div className="container d-flex align-items-center justify-content-between">
                <Link to={"/"} className="header-logo" />
                <ul className="nav">
                    <li className="m-2">
                        <Link to={"/"} className="nav-link">
                            <FaHome size={20}></FaHome>
                            &nbsp;&nbsp;&nbsp;Home
                        </Link>
                    </li>
                    <li className="m-2">
                        <Link to={"/cart"} className="nav-link position-relative">
                            <FaShoppingCart size={18}></FaShoppingCart>
                            &nbsp;&nbsp;&nbsp;Cart
                            { shoppingCartContext.items > 0 &&
                                <span key={shoppingCartContext.items} className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger grow-animation">
                                    {shoppingCartContext.items}
                                </span>
                            }
                        </Link>
                    </li>
                    <li className="m-2">
                        { !isLoggedIn ?
                            <a className="nav-link" onClick={() => showLoginModal()}>
                                <FiLogIn size={20}></FiLogIn>
                                &nbsp;&nbsp;&nbsp;Login
                            </a>
                        :
                            <div className="dropdown">
                                <a className="dropdown-toggle nav-link">
                                    <FaUserAlt size={16}></FaUserAlt>
                                    &nbsp;&nbsp;&nbsp;{username}
                                </a>
                                <ul className="dropdown-menu">
                                    <div className="pt-1 pb-2 px-3 dropdown-menu-custom">
                                        <li>
                                            <a className="dropdown-item nav-link">
                                                <BsBox size={15}></BsBox>
                                                &nbsp;&nbsp;&nbsp;My Orders
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={() => authenticationContext.logout()} className="dropdown-item nav-link">
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
            { displayLoginModal && <LoginPopup callbackFunction={closeLoginModal}/> }
        </div>
    );
}

export default Header;