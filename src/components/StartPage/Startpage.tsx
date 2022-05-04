import './StartPage.css'
import {Link} from "react-router-dom";
import SearchLink from "./SearchLink";

function Startpage() {
    return (
        <>
            <p className={"greeting"}>Welcome to Tomify!</p>
            <div className={"start-page-wrapper"}>
                <Link to={"/search"}><SearchLink/></Link>
            </div>
        </>
    )
}

export default Startpage;