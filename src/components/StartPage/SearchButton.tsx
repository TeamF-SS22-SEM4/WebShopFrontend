import './StartPage.css'
import {Card, Elevation, Icon} from "@blueprintjs/core";

function SearchButton() {
    return (
        <Card elevation={Elevation.FOUR} className={"link-card"} interactive={true}>
            <Icon icon={"search"} size={100}/>
        </Card>
    )
}

export default SearchButton;