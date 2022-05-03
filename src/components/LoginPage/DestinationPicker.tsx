import {FC} from "react";
import {Button} from "@blueprintjs/core";
import {Destination, local, remote} from "./LoginPage";

export type PickerProps = {
    dest: Destination
    setDest: any
}

const DestinationPicker: FC<PickerProps> = ({dest, setDest}: PickerProps) :JSX.Element => {
    const onLocalClick = () => {
        setDest(local)
    }
    const onRemoteClick = () => {
        setDest(remote)
    }

    return (
        <div className={"bp4-button-group bp4-fill"}>
            <Button text={"Local"} active={dest===local} onClick={onLocalClick}/>
            <Button text={"Remote"} active={dest===remote} onClick={onRemoteClick}/>
        </div>
    )
}

export default DestinationPicker;