import './PlaylistPage.css';
import {useEffect, useState} from "react";
import SongList from "./SongList";
import SongPlayer from "./SongPlayer";


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<string[]>(["bohemian rhapsody", "puppe"]); //TODO change type to PlayableSongDTO

    useEffect(() => {
        setTimeout(() =>
        setSongsLoading(false), 1000)

        //TODO api call;

    }, []);

    return (
        <>
            <p>Playlist</p>
            {songsLoading && <p>Loading...</p>}
            {!songsLoading && <SongList/>}
            <br/>
            <br/>

            <SongPlayer/>
        </>
    )
}

export default PlaylistPage;