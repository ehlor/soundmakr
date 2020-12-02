import React, { useState, useEffect, useRef } from 'react'
import Waveform from './Waveform'
import shallow from 'zustand/shallow'

import { useAudioContainerStore, useAudioStore, useToolbarStore } from '../GlobalState'
import { getDelayFromClick } from '../utils'
import styles from '../Styles/AudioItem.module.css'

export default function AudioItem({ id, containerRef, scrollRef, audioBuffer }) {
    const [isTrimmingOn, isMovingOn, isOkClicked, setSelectedAudio] = useToolbarStore(state => 
        [state.isTrimmingOn, state.isMovingOn, state.isOkClicked, state.setSelectedAudio]
    , shallow)
    const [width, trim, setTrim] = useAudioContainerStore(state => 
        [state.width, state.trim, state.setTrim]
    , shallow)
    const [audio, setAudio, audioContext] = useAudioStore(state => [state.audio, state.setAudio, state.audioContext], shallow)

    const [waveformWidth, setWaveformWidth] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isClickInsideItem, setIsClickInsideItem] = useState(false)
    const [posX, setPosX] = useState(0)
    const oldWidth = useRef(0)
    const clickedX = useRef()
    const clickedPosX = useRef()
    const elementRef = useRef()

    const handleMouseUp = (e) => {
        if (isTrimmingOn && trim.id === id && isClickInsideItem) {
            setIsClickInsideItem(false)
            const clickedPos = e.pageX - containerRef.current.offsetLeft + scrollRef.current.scrollLeft
            const x2 = Math.max(0, Math.min(clickedPos, waveformWidth)) / waveformWidth
            setTrim(id, x2)
        }
    }

    useEffect(() => {
        document.body.addEventListener('mouseup', handleMouseUp)
        return () => document.body.removeEventListener('mouseup', handleMouseUp)
    }, [handleMouseUp])

    useEffect(() => {
        if (!isTrimmingOn && isOkClicked && trim.id === id) {
            trimAudioBuffer()
            setTrim(id, 0, 0)
        }
    }, [isTrimmingOn])

    useEffect(() => {
        if (width === 0) return
        const oWidth = oldWidth.current
        setPosX(prev => (oWidth / width) * prev)
        oldWidth.current = width
    }, [width])

    const trimAudioBuffer = () => {
        const { numberOfChannels, length, sampleRate } = audioBuffer

        let { x1, x2 } = trim
        if (x1 > x2) [x1, x2] = [x2, x1];
        [x1, x2] = [x1, x2].map(x => Math.trunc(x * length)) // convert from percentage to sample frame index
        const newAudioBuffer = audioContext.createBuffer(numberOfChannels, length - (x2-x1), sampleRate)
        for(let i = 0; i < numberOfChannels; i++) {
            let channelData = audioBuffer.getChannelData(i)
            let newChannelData = new Float32Array(length - (x2-x1))
            newChannelData.set(channelData.subarray(0, x1), 0) // [0, x1)
            newChannelData.set(channelData.subarray(x2 + 1), x1) // (x2, n]
            newAudioBuffer.copyToChannel(newChannelData, i)
        }
        const newAudio = [...audio]
        newAudio[id].audioBuffer = newAudioBuffer
        setAudio(newAudio)
    }

    const handleDrag = (e) => {
        if (e.type === 'mousedown') {
            setIsDragging(true)
            clickedX.current = e.pageX
            clickedPosX.current = posX
        }
        else if (e.type === 'mouseup' && isDragging) {
            setIsDragging(false)
            audio[id].delay = getDelayFromClick(posX, containerRef, width)
        }
    }

    const handleMouseClick = (e) => {
        if (!isTrimmingOn && isMovingOn) {
            handleDrag(e)
        }
        else if (isTrimmingOn && e.type === 'mousedown') {
            setIsClickInsideItem(true)
            const x1Pos = e.pageX - containerRef.current.offsetLeft + scrollRef.current.scrollLeft
            const x1 = x1Pos / e.target.scrollWidth
            setTrim(id, x1, x1)
        }
    }

    const handleMouseMove = (e) => {
        if (isDragging) setPosX(Math.max(0, clickedPosX.current + (e.pageX - clickedX.current)))
    }

    return (
        <div 
            className={styles.audioItem}
            ref={elementRef}
            onClick={() => setSelectedAudio(id)}
            onMouseMove={handleMouseMove}
        >
            {isTrimmingOn && trim.id === id && <div className={styles.trimBlock} style={{
                left: `${Math.min(trim.x1, trim.x2) * waveformWidth}px`,
                width: `${(Math.max(trim.x1, trim.x2) * waveformWidth - Math.min(trim.x1, trim.x2) * waveformWidth)}px`
            }}/>}
            <Waveform 
                id={id}
                posX={posX}
                audioBuffer={audioBuffer}
                audioContext={audioContext}
                onMouseDown={handleMouseClick}
                onMouseUp={handleMouseClick}
                setWaveformWidth={setWaveformWidth}
            />
        </div>
    )
}