import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import shallow from 'zustand/shallow'

import { useAudioContainerStore, useToolbarStore, useEffectsStore } from '../GlobalState'
import styles from '../Styles/Waveform.module.css'

export default function Waveform(props) {
    const wavesurfer = useRef()
    const waveformRef = useRef()
    const prevAudioBuffer = useRef()
    const audioContainer = useAudioContainerStore()
    const [isSamplePlaying, setIsSamplePlaying] = useToolbarStore(state => [state.isSamplePlaying, state.setIsSamplePlaying], shallow)
    const [isMovingOn, selectedAudio] = useToolbarStore(state => [state.isMovingOn, state.selectedAudio], shallow)
    const filters = useEffectsStore(state => state.nodes[props.id].gain)
    const [width, setWidth] = useState(null)
    
    useEffect(() => {
        wavesurfer.current = (WaveSurfer.create({
            container: waveformRef.current,
            barWidth: 2,
            responsive: true,
            progressColor: '#1d98fd',
            cursorColor: '#303030',
            waveColor: '#fafafa',
            audioContext: props.audioContext
        }))
        wavesurfer.current.backend.setFilter(filters)
        wavesurfer.current.on('finish', () => {
            setIsSamplePlaying(false)
        })
        wavesurfer.current.on('ready', () => {
            audioContainer.setWidth(wavesurfer.current.getDuration())
        })
        wavesurfer.current.toggleInteraction()
        const destroy = () => {
            delete wavesurfer.current.backend
            wavesurfer.current.destroy()
        }
        window.addEventListener('beforeunload', destroy);
        return () => {
            destroy()
            window.removeEventListener('beforeunload', destroy)
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
        props.setWaveformWidth(waveformRef.current.scrollWidth)
    }, [width])

    useEffect(() => {
        if (wavesurfer.current === undefined) return
        if (isSamplePlaying && selectedAudio === props.id) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }, [isSamplePlaying])

    return (
        <div 
            className={styles.waveform}
            style={{ 
                marginLeft: props.posX, 
                width: `${width}%`,
                backgroundColor: selectedAudio === props.id ? 'rgb(80, 80, 92)' : 'rgb(92, 92, 92)'
            }}
            ref={waveformRef} 
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        />
    )
}