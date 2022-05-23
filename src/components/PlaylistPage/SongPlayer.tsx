import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface PlayerProps {
    songTitle?: string,
    source?: string,
}

function SongPlayer({songTitle = "", source = ""}: PlayerProps) {


    // TODO support dark mode

    // docs https://www.npmjs.com/package/react-h5-audio-player
    return (
        <>
            <AudioPlayer />
        </>
    )
}

export default SongPlayer;