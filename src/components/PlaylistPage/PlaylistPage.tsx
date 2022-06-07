import "@blueprintjs/table/lib/css/table.css";
import React, {useContext, useEffect, useState} from "react";
import SongPlayer from "./SongPlayer";
import {Spinner, SpinnerSize} from "@blueprintjs/core";
import SongRow from "./SongRow";
import {apiClient, AuthenticationContext} from "../../App";
import {GetSongRequest, PlayableSongDTO} from "../../openapi-client";
import fileDownload from 'js-file-download'


function PlaylistPage() {
    let [songsLoading, setSongsLoading] = useState(true);
    let [songs, setSongs] = useState<PlayableSongDTO[]>([]);
    let [playingIndex, setPlayingIndex] = useState<number>(0);
    let authState = useContext(AuthenticationContext);
    let [emptyPlaylist, setEmptyPlaylist] = useState(false);

    let downloadSong = (albumName?: string, title?: string) => {
        if(albumName !== undefined && title !== undefined) {
            const getSongRequest: GetSongRequest = {
                username: authState.username,
                albumName: albumName,
                songName: title
            };

            apiClient.getSong(getSongRequest).then(result => {
                fileDownload(result, title + ".mp3", "audio/mpeg");
            }).catch(response => {
                if (response.status === 404) {
                    alert("Song not found");
                } else {
                    alert("Something went wrong...");
                }
            });
        }
    }

    useEffect(() => {
        apiClient.getPlaylist({username: authState.username}).then(arr => {
            setSongs(arr);
            setSongsLoading(false);
            setEmptyPlaylist(false);
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

    return (
        <div className="content">
            <div className="container h-100 pt-5 pb-4">
            {
                emptyPlaylist ?
                <div className="row justify-content-center h-25">
                    <span className="h4 text-center m-auto">There seems to be nothing here. &#128577;</span>
                </div>

                :

                    <div className="justify-content-center" style={{height: "80%"}}>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="py-4 col-3">Album</th>
                                    <th className="py-4 col-3">Artist</th>
                                    <th className="py-4 col-3">Genre</th>
                                    <th className="py-4 col-1 text-center">Release</th>
                                    <th className="py-4 col-1 text-center">Price</th>
                                    <th className="py-4 col-3"></th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
            </div>
        </div>
    )
}

export default PlaylistPage;
