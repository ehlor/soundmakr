import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useAudioContainerStore, useToolbarStore } from '../GlobalState'
import shallow from 'zustand/shallow'

export default function Waveform(props) {
    const wavesurfer = useRef()
    const waveformRef = useRef()
    const prevAudioBuffer = useRef()
    const audioContainer = useAudioContainerStore()
    const [isSamplePlaying, setIsSamplePlaying] = useToolbarStore(state => [state.isSamplePlaying, state.setIsSamplePlaying], shallow)
    const [isMovingOn, selectedAudio] = useToolbarStore(state => [state.isMovingOn, state.selectedAudio], shallow)
    const [width, setWidth] = useState(null)
    
    useEffect(() => {
        wavesurfer.current = (WaveSurfer.create({
            container: waveformRef.current,
            barWidth: 2,
            responsive: true,
            audioContext: props.audioContext
        }))
        wavesurfer.current.on('finish', () => {
            setIsSamplePlaying(false)
        })
        wavesurfer.current.on('ready', () => {
            audioContainer.setWidth(wavesurfer.current.getDuration())
        })
        wavesurfer.current.toggleInteraction()
        return () => {
            delete wavesurfer.current.backend
            wavesurfer.current.destroy()
        }
    }, [])

    useEffect(() => {
        wavesurfer.current.toggleInteraction()
    }, [isMovingOn])

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
/*
    const play = () => {
        if (wavesurfer.current === undefined) return
        if (isSamplePlaying && selectedAudio === props.id) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }
    play()
*/
    useEffect(() => {
        if (wavesurfer.current === undefined) return
        if (isSamplePlaying && selectedAudio === props.id) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }, [isSamplePlaying])

    return (
        <div 
            style={{ marginLeft: props.posX, width: `${width}%` }}
            ref={waveformRef} 
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        />
    )
}