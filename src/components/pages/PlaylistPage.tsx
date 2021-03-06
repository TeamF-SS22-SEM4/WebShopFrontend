import React, {useContext, useEffect, useState} from "react";
import {GetSongRequest, PlayableSongDTO} from "../../openapi-client";
import {apiClient, AuthenticationContext} from "../../App";
import fileDownload from "js-file-download";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {MdFileDownload, MdPlayArrow} from "react-icons/md";

const PlaylistPage = () => {

    const [songs, setSongs] = useState<PlayableSongDTO[]>([]);
    const [emptyPlaylist, setEmptyPlaylist] = useState(true);
    const [playingSong, setPlayingSong] = useState<string>("");
    const [playingSongIndex, setPlayingSongIndex] = useState<number>(0);
    const [playingSongTitle, setPlayingSongTitle] = useState<string>("");
    let authState = useContext(AuthenticationContext);

    useEffect(() => {
        apiClient.getPlaylist({username: authState.username}).then(arr => {
            setSongs(arr);
            setEmptyPlaylist(false);
        }).catch(err => {
            if (err.status === 404) {
                setEmptyPlaylist(true);
            }
        })
    }, [authState.username]);

    const downloadSong = (albumName?: string, title?: string) => {
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

    const playSong = (index: number, albumName?: string, title?: string) => {
        if(albumName !== undefined && title !== undefined) {
            const getSongRequest: GetSongRequest = {
                username: authState.username,
                albumName: albumName,
                songName: title
            };

            apiClient.getSong(getSongRequest).then(result => {
                const url = URL.createObjectURL(result);
                setPlayingSong(url);
                setPlayingSongIndex(index);
                setPlayingSongTitle(title);
            }).catch(response => {
                if (response.status === 404) {
                    alert("Song not found");
                } else {
                    alert("Something went wrong...");
                }
            });
        }
    }

    const playNext = () => {
        let nextIndex = playingSongIndex + 1;

        // Check if it was the last song
        if(nextIndex >= songs.length) {
            nextIndex = 0;
        }

        let song: PlayableSongDTO = songs[nextIndex]

        playSong(nextIndex, song.albumName, song.title);
    }

    const playPrevious = () => {
        let previousIndex = playingSongIndex - 1;

        if(previousIndex < 0) {
            previousIndex = songs.length - 1;
        }

        let song: PlayableSongDTO = songs[previousIndex]

        playSong(previousIndex, song.albumName, song.title);
    }

    return (
        <div className="content">
            <div className="container h-100 py-5">
                <h4 className="mb-3">Playlist</h4>
                {songs.length === 0 ?
                    <div className="row justify-content-center h-25">
                        <span className="h4 text-center m-auto">No songs found!</span>
                    </div>
                :
                    <>
                        <div className="justify-content-center table-wrapper" style={{maxHeight: "80%"}}>
                                <table className="table">
                                    <thead className="fixed-head">
                                    <tr>
                                        <th className="py-4"></th>
                                        <th className="py-4">Title</th>
                                        <th className="py-4">Album</th>
                                        <th className="py-4">Artist</th>
                                        <th className="py-4">Duration</th>
                                        <th className="py-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        songs.map((song, index) =>
                                            <tr key={song.songId}>
                                                <td className="align-middle">
                                                    <button className='btn btn-p btn-sm m-1'
                                                            onClick={() => playSong(index, song.albumName, song.title)}>
                                                        <MdPlayArrow size={20}></MdPlayArrow>
                                                    </button>
                                                </td>
                                                <td className="align-middle">{song.title}</td>
                                                <td className="align-middle">{song.albumName}</td>
                                                <td className="align-middle">{song.artists}</td>
                                                <td className="align-middle">{song.duration}</td>
                                                <td className="align-middle">
                                                    <button className='btn btn-p btn-sm'
                                                            onClick={() => downloadSong(song.albumName, song.title)}>
                                                        <MdFileDownload size={20}></MdFileDownload>
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                        </div>
                    </>
                }
            </div>
            <div style={{position: "fixed", bottom: 0, width: "100%"}}>
                <p className="px-4">{playingSongTitle}</p>
                <AudioPlayer src={playingSong}
                             onEnded={playNext}
                             onClickNext={playNext}
                             onClickPrevious={playPrevious}
                             autoPlay={false}
                             autoPlayAfterSrcChange={true}
                             showJumpControls={false}
                             showSkipControls={true}
                             showFilledVolume={true}
                             className="player"/>
            </div>
        </div>
    )
}

export default PlaylistPage;