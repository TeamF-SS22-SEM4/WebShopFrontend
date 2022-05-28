import "@blueprintjs/table/lib/css/table.css";
import './PlaylistPage.css';
import {useContext, useEffect, useState} from "react";
import SongPlayer from "./SongPlayer";
import {Spinner, SpinnerSize} from "@blueprintjs/core";
import SongRow from "./SongRow";
import {apiClient, AuthenticationContext} from "../../App";
import {GetSongRequest, PlayableSongDTO} from "../../openapi-client";


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<PlayableSongDTO[]>([]);
    let [playingIndex, setPlayingIndex] = useState<number>(0);
    let authState = useContext(AuthenticationContext);
    let [emptyPlaylist, setEmptyPlaylist] = useState(false);

    let downloadSong = (songId?: string) => {
        if(songId !== undefined) {
            const getSongRequest: GetSongRequest = {
                songId: songId
            };

            apiClient.getSong(getSongRequest).then(result => {
                let data = new Blob([result], {type: 'audio/mpeg'});
                let url = window.URL.createObjectURL(data);
                let tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.setAttribute('download', 'sample.mp3');
                tempLink.click();
            }).catch(response => {
                // TODO: Error handling
            });
        }
    }

    let playNext = () => {
        //TODO
        console.log("playing next")
    }

    useEffect(() => {
        apiClient.getPlaylist({username: authState.username}).then(arr => {
            setSongs(arr);
            setSongsLoading(false);
            setEmptyPlaylist(false)
        }).catch(err => {
            if (err.status === 404) {
                setEmptyPlaylist(true);
                setSongsLoading(false);
            } else {
                alert("something went wrong")
            }
            //TODO state for misc error
        })
    }, [authState.username]);

    let songRows = songs.map((dto, index) => <SongRow index={index} songId={dto.songId} title={dto.title} artist={dto.artists} duration={dto.duration} setPlayingIndex={setPlayingIndex} downloadSong={downloadSong}/>)

    let currentSrc;
    if (songs[playingIndex]) {
        currentSrc = songs[playingIndex].filePath
    } else {
        currentSrc = "";
    }
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

            {emptyPlaylist && <h1 style={{textAlign: "center"}}>There seems to be nothing here. &#128577;</h1>}

            <div style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
            }}>
                <SongPlayer source={currentSrc} playNext={playNext}/>
            </div>
        </div>
    )
}

export default PlaylistPage;