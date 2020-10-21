import React, { useRef } from 'react'
import AudioItem from './AudioItem'
import { useAudioContainerStore } from '../GlobalState'

export default function AudioContainer({ audioFiles, setAudioFileUrl }) {
    const mainAudioContext = useRef(() => new AudioContext({ sampleRate: 44100 }))
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
                    id={index}
                    url={url}
                    setAudioFileUrl={setAudioFileUrl} 
                />
            ))}
        </div>
    )
}