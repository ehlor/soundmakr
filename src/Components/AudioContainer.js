import React, { useEffect, useRef, useState } from 'react'
import shallow from 'zustand/shallow'
import { Scrollbar } from 'react-scrollbars-custom'

import AudioItem from './AudioItem'
import { getDelayFromClick } from '../utils'
import { useAudioContainerStore, useAudioStore, useEffectsStore, useToolbarStore } from '../GlobalState'
import styles from '../Styles/AudioContainer.module.css'

export default function AudioContainer() {
    const [audioContext, audio, offset, setOffset] = useAudioStore(state => [
        state.audioContext, state.audio, state.offset, state.setOffset
    ], shallow)
    const [isAllPlaying, setIsAllPlaying] = useToolbarStore(state => [state.isAllPlaying, state.setIsAllPlaying], shallow)
    const [width, modifyWidth] = useAudioContainerStore(state => [state.width, state.modifyWidth], shallow)
    const nodes = useEffectsStore(state => state.nodes)

    const [playing, setPlaying] = useState(-1)
    const [isTrackXVisible, setIsTrackXVisible] = useState(false)
    const [zoomInfo, setZoomInfo] = useState({
        positionRatio: 0,
        positionPixel: 0
    })
    const [isMouseDown, setIsMouseDown] = useState(false)
    const sources = useRef([])
    const containerRef = useRef()
    const scrollRef = useRef()
    const startTime = useRef(0)
    const interval = useRef()

    useEffect(() => {
        containerRef.current.addEventListener('wheel', (e) => {
            e.preventDefault()
        }, { passive: false })
    }, [])

    useEffect(() => {
        try {
            if (isAllPlaying) {
                sources.current = audio.map((data, index) => {
                    const source = audioContext.createBufferSource()
                    source.buffer = data.audioBuffer
                    source.connect(nodes[index].gain)
                    return source
                })
                setPlaying(sources.current.length)
                const currentTime = audioContext.currentTime
                sources.current.forEach((source, i) => {
                    source.onended = () => {
                        source.disconnect()
                        setPlaying(prevPlaying => prevPlaying - 1)
                    }
                    source.start(currentTime + Math.max(0, audio[i].delay - offset) + 0.02, Math.max(0, offset - audio[i].delay)) // 20 ms to sync up
                })
                startTime.current = currentTime
                interval.current = setInterval(() => setOffset(offset + audioContext.currentTime - startTime.current), 5)
            } else {
                sources.current.forEach(source => source.disconnect())
                //sources.current.forEach(source => source.stop(currentTime + 0.02))
                clearInterval(interval.current)
                if (playing < 0) setOffset(0)
                //else setOffset(startTime.current === 0 ? 0 : offset + currentTime - startTime.current)
            }
        } catch(err) {
            console.error(err)
        }
    }, [isAllPlaying])

    useEffect(() => {
        if (playing === 0) {
            setPlaying(-1)
            setIsAllPlaying(false)
        }
    }, [playing]);

    const zoomContainer = (e) => {
        const pixelPos = e.pageX - containerRef.current.offsetLeft + scrollRef.current.scrollLeft
        setZoomInfo({
            positionPixel: pixelPos,
            positionRatio: pixelPos / scrollRef.current.scrollWidth,
            containerPosPixel: e.pageX - containerRef.current.offsetLeft
        })
        if (e.deltaY < 0) modifyWidth(true)
        else modifyWidth(false)
    }

    const handleClick = (e) => {
        setIsMouseDown(false)
        if (e.target.classList.contains("ScrollbarsCustom-Track") 
            || e.target.classList.contains("ScrollbarsCustom-Thumb")) return
        const pixelPos = e.pageX - containerRef.current.offsetLeft + scrollRef.current.scrollLeft
        setOffset(getDelayFromClick(pixelPos, containerRef, width))
    }

    const handleScrollbarUpdate = (scrollValues, prevScrollValues) => {
        setIsTrackXVisible(scrollValues.trackXVisible)
        if (isMouseDown) return
        if (scrollValues.contentScrollWidth !== prevScrollValues.contentScrollWidth) {
            const newPixelPos = scrollValues.contentScrollWidth * zoomInfo.positionRatio
            scrollRef.current.scrollTo(newPixelPos - zoomInfo.containerPosPixel)
        }
    }

    return (
        <div 
            id={styles.audioContainer}
            ref={containerRef} 
            onWheel={zoomContainer}
            onClick={handleClick}
            onMouseDown={() => setIsMouseDown(true)}
            style={{
                height: `max(15vh, min(calc(15vh*${audio.length}), 45vh))`
            }}
        >
            <Scrollbar
                ref={scrollRef}
                onUpdate={(scrollValues, prevScrollValues) => handleScrollbarUpdate(scrollValues, prevScrollValues)}
                style={{ 
                    position: 'relative',
                    height: isTrackXVisible ? `min(calc(15vh*${audio.length} + 10px), calc(45vh + 10px))` 
                        : `min(calc(15vh*${audio.length}), 45vh)`,
                    width: audio.length <= 3 ? '100%' : 'calc(100% + 10px)'
                }}
                noScrollY={audio.length <= 3}
            >
                <div 
                    id={styles.progressBar}
                    style={{
                        height: `calc(${audio.length}*15vh)`,
                        left: (offset / width) * containerRef.current?.scrollWidth
                    }}
                />
                {audio.map((data, index) => (
                    <AudioItem
                        key={index}
                        id={index}
                        containerRef={containerRef}
                        scrollRef={scrollRef}
                        audioBuffer={data.audioBuffer}
                    />
                ))}
            </Scrollbar>
        </div>
    )
}