import React, {useContext, useEffect, useState} from "react";
import {AuthenticationContext, ShoppingCartContext, useThemeContext} from "../../App";
import {Link} from "react-router-dom";
import {FaHome, FaMusic, FaShoppingCart, FaSquareFull, FaUserAlt} from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import LoginModal from "../modals/LoginModal";
import Cookie from "universal-cookie";
import Cookies from "universal-cookie";
import {CgColorPicker} from "react-icons/cg";
import {IoPricetags} from "react-icons/io5";

const Header = () => {

    const authenticationContext = useContext(AuthenticationContext);
    const shoppingCartContext = useContext(ShoppingCartContext);

    const isLoggedIn = authenticationContext.loggedIn;
    const username = authenticationContext.username;
    const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false);
    const [theme, setTheme] = useThemeContext();

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

    useEffect(() => {
        const cookie = new Cookies();
        if(!authenticationContext.loggedIn){
            let sessionCookie = cookie.get("sessionCookie");
            if (sessionCookie != null) {
                const sessionIDAndUser = sessionCookie.split("/");
                let cookieLoginInfo = {sessionId: sessionIDAndUser[0], username: sessionIDAndUser[1], loggedIn: true};
                authenticationContext.storeLogin(cookieLoginInfo);
            }
        }

        let themeCookie = cookie.get("Theme");

        if (themeCookie != null) {
            loadTheme(themeCookie);
        }
    });

    function showLoginModal() {
        setDisplayLoginModal(true);
    }

    function closeLoginModal() {
        setDisplayLoginModal(false);
    }

    function logout() {
        const cookie = new Cookie();
        cookie.remove("sessionCookie", {path:"/"});
        authenticationContext.logout()
    }

    function loadTheme(value: string) {
        const cookie = new Cookies();
        cookie.set("Theme", value, {path: "/"});
        setTheme(value);
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
                                    <div className="pt-1 pb-2 px-2 dropdown-menu-custom">
                                        <li>
                                            <Link to={"/playlist"} className="dropdown-item nav-link">
                                                <FaMusic size={15}></FaMusic>
                                                &nbsp;&nbsp;&nbsp;Playlist
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={"/orders"} className="dropdown-item nav-link">
                                                <IoPricetags size={15}></IoPricetags>
                                                &nbsp;&nbsp;&nbsp;Purchases
                                            </Link>
                                        </li>
                                        <li>
                                            <a onClick={() => logout()} className="dropdown-item nav-link">
                                                <FiLogOut size={15}></FiLogOut>
                                                &nbsp;&nbsp;&nbsp;Logout
                                            </a>
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        }
                    </li>
                    <li className="m-2">
                        <div className="dropdown">
                            <a className="nav-link">
                                <CgColorPicker size={20}></CgColorPicker>
                            </a>
                            <ul className="dropdown-menu">
                                <div className="dropdown-menu-custom p-2">
                                    <li className="no-border d-flex">
                                        <a className="pointer p-1 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #000000 50%, #583475 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-violet")}>
                                            </FaSquareFull>
                                        </a>
                                        <a className="pointer p-1 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #000000 50%, #C27F00 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-orange")}>
                                            </FaSquareFull>
                                        </a>
                                        <a className="pointer p-1 pe-3 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #000000 50%, #005078 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-blue")}>
                                            </FaSquareFull>
                                        </a>
                                        <a className="pointer p-1 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #ffffff 50%, #583475 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-light mode-violet")}>
                                            </FaSquareFull>
                                        </a>
                                        <a className="pointer p-1 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #ffffff 50%, #C27F00 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-light mode-orange")}>
                                            </FaSquareFull>
                                        </a>
                                        <a className="pointer p-1 d-flex">
                                            <FaSquareFull className="align-self-center" style={{color: "transparent", background: "linear-gradient(135deg, #ffffff 50%, #005078 50%)", border: "2px solid black", borderRadius: "5px"}} size={18}
                                                          onClick={() => loadTheme("mode-dark mode-light mode-blue")}>
                                            </FaSquareFull>
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            { displayLoginModal && <LoginModal callbackFunction={closeLoginModal}/> }
        </div>
    );
}

export default Header;