import {Button} from "@blueprintjs/core";
import {useState} from "react";

interface RowProps {
    index: number,
    songId?: string,
    title?: string,
    artist?: string,
    duration?: string,
    setPlayingIndex: (i: number) => void,
    downloadSong: (s?: string) => void
}
function SongRow({index, songId, title, artist, duration, setPlayingIndex, downloadSong}: RowProps) {
    let [hovered, setHovered] = useState(false);

    return (
        <tr className={"hoverable"} key={index} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <td style={{
                marginLeft: 10,
            }}>
                <Button icon={"play"} minimal={!hovered} onClick={() => setPlayingIndex(index)}/>
            </td>
            <td style={{
                padding: 8
            }}>
            <span style={{
                textAlign: "left",
                marginLeft: 10
            }}>
                {title}
            </span>
            </td>
            <td>
            <span style={{
                marginLeft: 10,
                textAlign: "center",
            }}>
                {artist}
            </span>
            </td>
            <td>
            <span style={{
                textAlign: "end",
                marginRight: 10,
                float: "right"
            }}>
                {duration}
            </span>
            </td>
            <td style={{
                marginLeft: 10,
            }}>
                <Button icon={"cloud-download"} minimal={!hovered} onClick={() => downloadSong(songId)}/>
            </td>
        </tr>
    )
}

export default SongRow;