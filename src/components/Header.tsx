import React from "react";
import {Button} from "@blueprintjs/core";
import {Link} from "react-router-dom";


const logoStyle = {
    width: '100%',
    height: 'auto'
}

const Header = () => {
    return (
        <div className="header">
            {/*<div className="container">*/}
            {/*    <div className="col bg-success">*/}
            {/*        <Button>test</Button>*/}
            {/*    </div>*/}
            {/*    <div className="col bg-warning">*/}
            {/*        <Button>test</Button>*/}
            {/*    </div>*/}
            {/*    <div className="col bg-success">*/}
            {/*        <Button>test</Button>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <nav className="navbar h-100 navbar-expand-md navbar-dark bg-dark" aria-label="Fourth navbar example">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Expand at md</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsExample04">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown04"
                                   data-bs-toggle="dropdown" aria-expanded="false">Dropdown</a>
                                <ul className="dropdown-menu" aria-labelledby="dropdown04">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;