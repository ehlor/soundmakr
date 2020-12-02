import React from 'react'
import audioEncoder from 'audio-encoder'

import Button from './Button'
import { useAudioStore, useEffectsStore } from '../GlobalState'

export default function ButtonExport({ className, audioFileFormat, children }) {
    const audio = useAudioStore.getState().audio
    const effects = useEffectsStore.getState().effects
    
    const handleClick = () => {
        const maxSampleLength = Math.max(...audio.map(sound => sound.audioBuffer.length + Math.trunc(sound.delay * 44100)))
        const offlineCtx = new OfflineAudioContext(2, maxSampleLength, 44100)
        const sources = getConnectedSources(audio, effects, offlineCtx)
        const currentTime = offlineCtx.currentTime
        sources.forEach((source, i) => source.start(currentTime + audio[i].delay + 0.02)) // 20 ms to sync up
        offlineCtx.oncomplete = (e) => {
            audioEncoder(e.renderedBuffer, audioFileFormat === '.wav' ? 0 : 320, null, blob => {
                const date = new Date().toJSON().slice(0, 19).replace('T', '--').replace(/:/g, '-')
                let a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = `${date}${audioFileFormat}`
                a.click()
            })
        }
        offlineCtx.startRendering()
    }

    return (
        <Button 
            className={className}
            onClick={handleClick}
            title="Save"
        >
            {children}
        </Button>
    )
}



const filterList = ['lowpass', 'highpass', 'bandpass', 'peaking']

// creates audio graph
function getConnectedSources(audio, effects, offlineCtx) {
    return audio.map((data, id) => {
        const source = offlineCtx.createBufferSource()
        source.buffer = data.audioBuffer

        const gain = offlineCtx.createGain()
        gain.gain.value = effects[id].gain
        
        let input = source.connect(gain)
        filterList.forEach(filter => {
            if (effects[id][filter].on === true) {
                const node = offlineCtx.createBiquadFilter()
                node.type = filter
                node.frequency.value = effects[id][filter].frequency.value
                node.Q.value = effects[id][filter].Q.value
                if (filter === 'peaking') node.gain.value = effects[id][filter].gain.value
                input = input.connect(node)
            }
        })
        input.connect(offlineCtx.destination)

        return source
    })
}