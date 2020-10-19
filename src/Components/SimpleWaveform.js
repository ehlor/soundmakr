import React, { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

export default function SimpleWaveform({ url, play, setPlay }) {
    const waveformRef = useRef()
    const wavesurfer = useRef()

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current
        })
        wavesurfer.current.load(url)
        wavesurfer.current.on('finish', () => setPlay(prev => { return { ...prev, state: false }}))
        return () => {
            delete wavesurfer.current.backend
            wavesurfer.current.destroy()
        }
    }, [url, setPlay])

    useEffect(() => {
        if (play) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }, [play])

    return <div ref={waveformRef} />
}
