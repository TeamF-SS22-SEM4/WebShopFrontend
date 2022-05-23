import './PlaylistPage.css';
import {useEffect, useState} from "react";
import SongPlayer from "./SongPlayer";
import {Spinner, SpinnerSize} from "@blueprintjs/core";


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<string[]>(["bohemian rhapsody", "puppe"]); //TODO change type to PlayableSongDTO
    let [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        setTimeout(() =>
        setSongsLoading(false), 1000)

        //TODO api call;

    }, []);

    return (
        <>
            <p>Playlist</p>
            {songsLoading && <Spinner size={SpinnerSize.LARGE}/>}
            {!songsLoading && <p>list</p>}
            <br/>
            <br/>


            <div style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
            }}>
                <SongPlayer/>
            </div>
        </>
    )
}

export default PlaylistPage;