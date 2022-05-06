import './StartPage.css'
import SearchButton from "./SearchButton";
import {Card, Elevation, Icon} from "@blueprintjs/core";
import {Link} from "react-router-dom";

function Startpage() {
    return (
        <>
            <p className={"greeting"}>Welcome to Tomify!</p>
            <div className={"start-page-wrapper"}>
                <Link to={"/search"}><SearchButton/></Link>

                <Link to={"/restrictedTest"} >
                    <Card elevation={Elevation.FOUR} className={"link-card"} interactive={true}>
                        <Icon icon={"lock"} size={100}/>
                    </Card>
                </Link>
            </div>
        </>
    )
}

export default Startpage;