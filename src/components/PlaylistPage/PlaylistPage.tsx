import "@blueprintjs/table/lib/css/table.css";
import './PlaylistPage.css';
import {useContext, useEffect, useState} from "react";
import SongPlayer from "./SongPlayer";
import {Button, Spinner, SpinnerSize} from "@blueprintjs/core";
import SongRow from "./SongRow";
import {apiClient, AuthenticationContext} from "../../App";
import {PlayableSongDTO} from "../../openapi-client";


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<PlayableSongDTO[]>([]); //TODO change type to PlayableSongDTO
    let [playingIndex, setPlayingIndex] = useState<number | undefined>();
    let authState = useContext(AuthenticationContext);

    let downloadSong = (songId: string) => {
        // TODO: api call with songId
        alert(songId);
    }

    let playNext = () => {
        //TODO
        console.log("playing next")
    }

    useEffect(() => {
        apiClient.getPlaylist({username: authState.username}).then(arr => {
            setSongs(arr);
            setSongsLoading(false);
        }).catch(err => {
            alert("something went wrong")
        })
    }, []);

    // let dummySongsDTO = [{title: "Bohemian Rhapsody", duration: "6:00", artist: "Queen"}, {title: "Don't Stop Me Now", duration: "3:30", artist: "Queen"}];
    let songRows = songs.map((dto, index) => <SongRow index={index} title={dto.title} artist={"TODO artist"} duration={dto.duration} setPlayingIndex={setPlayingIndex} downloadSong={downloadSong}/>)

    return (
        <div>
            <h1 style={{textAlign: "center", fontSize: 45}}>Your songs</h1>
            {songsLoading && <Spinner size={SpinnerSize.LARGE}/>}
            {!songsLoading && <div>
                <table style={{width: "100%"}}>
                    <thead>
                        <tr>
                            <th></th> {/*Play- button*/}
                            <th><h1 style={{textAlign: "center"}}>Title</h1></th>
                            <th><h1 style={{textAlign: "center"}}>Artist</h1></th>
                            <th><h1 style={{textAlign: "center"}}>Duration</h1></th>
                            <th></th>
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
                <SongPlayer source={ playingIndex ? /*TODO source from dto*/ "" : undefined} playNext={playNext}/>
            </div>
        </div>
    )
}

export default PlaylistPage;