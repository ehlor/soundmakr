import React, { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

import styles from '../Styles/Waveform.module.css'

export default function SimpleWaveform({ url, play, setPlay }) {
    const waveformRef = useRef()
    const wavesurfer = useRef()

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            barWidth: 2,
            responsive: true,
            progressColor: '#1d98fd',
            cursorColor: '#303030',
            waveColor: '#fafafa',
        })
        wavesurfer.current.on('finish', () => setPlay(prev => ({ ...prev, state: false })))
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
        wavesurfer.current.load(url)
    }, [url])

    useEffect(() => {
        if (play) wavesurfer.current.play()
        else wavesurfer.current.pause()
    }, [play])

    return (
        <div
            className={styles.waveform} 
            ref={waveformRef} 
        />
    )
}
