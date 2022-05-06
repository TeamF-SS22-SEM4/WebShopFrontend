import './StartPage.css'
import SearchButton from "./SearchButton";
import RequiresUserLink from "../LoginPage/RequiresUserLink";
import {Card, Elevation} from "@blueprintjs/core";

function Startpage() {

    return (
        <>
            <p className={"greeting"}>Welcome to Tomify!</p>
            <div className={"start-page-wrapper"}>
                <RequiresUserLink to={"/search"}><SearchButton/></RequiresUserLink>

                <RequiresUserLink to={"/search"} >
                    <Card elevation={Elevation.FOUR} className={"link-card"} interactive={true}>
                        <p>This is  very secure link, try getting there.</p>
                    </Card>
                </RequiresUserLink>
            </div>
        </>
    )
}

export default Startpage;