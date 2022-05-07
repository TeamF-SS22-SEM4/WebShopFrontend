import '../../App.css'
import './StartPage.css'
import SearchButton from "./SearchButton";
import {Card, Elevation, Icon} from "@blueprintjs/core";
import {Link} from "react-router-dom";

function Startpage() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p className="pageTitle">Welcome to Tomify!</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <Link to={"/search"}><SearchButton/></Link>
                    </div>
                    <div className="col-4">
                        <Link to={"/cart"} >
                            <Card elevation={Elevation.FOUR} className={"link-card"} interactive={true}>
                                <Icon icon={"shopping-cart"} size={100}/>
                            </Card>
                        </Link>
                    </div>
                    <div className="col-4">
                        <Link to={"/restrictedTest"} >
                            <Card elevation={Elevation.FOUR} className={"link-card"} interactive={true}>
                                <Icon icon={"lock"} size={100}/>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Startpage;