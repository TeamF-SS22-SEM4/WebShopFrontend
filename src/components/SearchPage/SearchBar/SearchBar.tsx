import { useState } from "react";

interface SearchBarProps {
    callbackFunction: (searchTerm: string) => void;
}

const SearchBar = ({callbackFunction}: SearchBarProps) => {
    return (
        <div>
            <div className="bp4-input-group bp4-large .modifier">
                <span className="bp4-icon bp4-icon-search"/>
                <input onChange={event => callbackFunction(event.target.value)} className="bp4-input"  type="search" placeholder="Search.." dir="auto" />
            </div>
        </div>
    )
}

export default SearchBar;