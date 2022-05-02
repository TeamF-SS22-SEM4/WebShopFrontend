import {MenuItem, Menu} from "@blueprintjs/core";

function AccountDropdown() {
    return (
        <Menu>
            <MenuItem text={"View Account"}/>
            <MenuItem text={"Log out"}/>
        </Menu>
    )
}

export default AccountDropdown;