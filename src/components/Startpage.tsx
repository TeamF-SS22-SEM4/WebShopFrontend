import {Button} from "@blueprintjs/core";
import logo from './../icon.png'
import SearchBar from "./SearchBar/SearchBar";

function Startpage() {

    return (
        <div>
            <SearchBar></SearchBar>
            <p>this i s the start page</p>
            <img src={logo} className="App-logo" alt="logo" />
            <Button intent="success" text={"test"}></Button>
        </div>
    )
}

export default Startpage;