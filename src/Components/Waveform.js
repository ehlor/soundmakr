import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useAudioContainerStore } from '../GlobalState'

export default function Waveform(props) {
    const wavesurfer = useRef()
    const waveformRef = useRef()
    const prevAudioBuffer = useRef()
    const audioContainer = useAudioContainerStore()
    const [width, setWidth] = useState(null)
    
    useEffect(() => {
        wavesurfer.current = (WaveSurfer.create({
            container: waveformRef.current,
            barWidth: 2,
            responsive: true,
            audioContext: props.audioContext
        }))
        wavesurfer.current.on('finish', () => {
            props.onPlayFinish()
        })
        wavesurfer.current.on('ready', () => {
            audioContainer.setWidth(wavesurfer.current.getDuration())
        })
        return () => {
            delete wavesurfer.current.backend
            wavesurfer.current.destroy()
        }
    }, [])

    useEffect(() => {
        if(prevAudioBuffer.current !== props.audioBuffer) {
            wavesurfer.current.loadDecodedBuffer(props.audioBuffer)
            prevAudioBuffer.current = props.audioBuffer
        }
    }, [props.audioBuffer])

    useEffect(() => {
        setWidth((wavesurfer.current?.getDuration() / audioContainer.width)*100)
    }, [props.audioBuffer, audioContainer.width])

    useEffect(() => {
        if (waveformRef.current.scrollWidth !== waveformRef.current.children[0].scrollWidth) {
            wavesurfer.current.seekTo(0)
        } 
        wavesurfer.current.drawBuffer()
    }, [width])

    const play = () => {
        if (wavesurfer.current === undefined) return
        if (props.isSamplePlaying) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }
    play()

    return (
        <div 
            style={{ marginLeft: props.posX, width: `${width}%` }}
            ref={waveformRef} 
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        />
    )
}