import React from "react";
import {Button} from "@blueprintjs/core";
import {Link} from "react-router-dom";


const logoStyle = {
    width: '100%',
    height: 'auto'
}

const Header = () => {
    return (
        <div className="header d-flex">
            <nav className="navbar navbar-dark bg-dark">
            <Link to={'/#home'} className="navbar-brand">
                    <img src="logo.png" style={logoStyle} className="d-inline-block align-top" alt=""/>
                        Bootstrap
                </Link>
                <div className="col bg-success">
                    <Button>test</Button>
                </div>
                <div className="col bg-warning">
                    <Button>test</Button>
                </div>
                <div className="col bg-success">
                    <Button>test</Button>
                </div>
            </nav>


        </div>
    );
}

export default Header;