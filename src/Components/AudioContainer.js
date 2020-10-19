import React from 'react'
import AudioItem from './AudioItem'
import { useAudioContainerStore } from '../GlobalState'

export default function AudioContainer(props) {
    const { audioFiles, onPlayFinish, setAudioFileUrl,
        isSamplePlaying, isTrimmingOn, isOkClicked } = props
    const modifyWidth = useAudioContainerStore(state => state.modifyWidth)

    const zoomContainer = (event) => {
        if (event.deltaY < 0) modifyWidth(true)
        else modifyWidth(false)
    }

    return (
        <div id="audio-container" onWheel={zoomContainer}>
            {audioFiles.map((url, index) => (
                <AudioItem
                    key={index}
                    url={url}
                    onPlayFinish={onPlayFinish}
                    setAudioFileUrl={setAudioFileUrl} 
                    isSamplePlaying={isSamplePlaying}
                    isTrimmingOn={isTrimmingOn}
                    isOkClicked={isOkClicked}
                />
            ))}
        </div>
    )
}