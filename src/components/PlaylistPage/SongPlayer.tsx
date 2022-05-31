import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface PlayerProps {
    songTitle?: string,
    source?: string,
    playNext: () => void,
}

function SongPlayer({songTitle = "", source = "", playNext}: PlayerProps) {
    // TODO support dark mode

    // docs https://www.npmjs.com/package/react-h5-audio-player
    return (
        <>
            <AudioPlayer src={source} autoPlay={false} autoPlayAfterSrcChange={false} onEnded={playNext} onClickNext={playNext} showJumpControls={false} showSkipControls={true}/>
        </>
    )
}

export default SongPlayer;