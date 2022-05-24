import "@blueprintjs/table/lib/css/table.css";
import './PlaylistPage.css';
import {useEffect, useState} from "react";
import SongPlayer from "./SongPlayer";
import {Button, Spinner, SpinnerSize} from "@blueprintjs/core";
import SongRow from "./SongRow";


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<string[]>(["bohemian rhapsody", "puppe"]); //TODO change type to PlayableSongDTO
    let [playingIndex, setPlayingIndex] = useState<number | undefined>();

    let playNext = () => {
        //TODO
        console.log("playing next")
    }

    useEffect(() => {
        setTimeout(() =>
        setSongsLoading(false), 200)
        //TODO api call
    }, []);

    let dummySongsDTO = [{title: "Bohemian Rhapsody", duration: "6:00", artist: "Queen"}, {title: "Don't Stop Me Now", duration: "3:30", artist: "Queen"}];
    let songRows = dummySongsDTO.map((dto, index) => <SongRow index={index} title={dto.title} artist={dto.artist} duration={dto.duration} setPlayingIndex={setPlayingIndex}/>)

    return (
        <div>
            <h1 style={{textAlign: "center", fontSize: 45}}>Your song's</h1>
            {songsLoading && <Spinner size={SpinnerSize.LARGE}/>}
            {!songsLoading && <div>
                <table style={{width: "100%"}}>
                    <thead>
                        <tr>
                            <th></th> {/*Play- button*/}
                            <th><h1 style={{textAlign: "center"}}>Title</h1></th>
                            <th><h1 style={{textAlign: "center"}}>Artist</h1></th>
                            <th><h1 style={{textAlign: "center"}}>Duration</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        {songRows}
                    </tbody>
                </table>
            </div>}

            <div style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
            }}>
                <SongPlayer source={ playingIndex ? /*TDOO source from dto*/ "" : undefined} playNext={playNext}/>
            </div>
        </div>
    )
}

export default PlaylistPage;