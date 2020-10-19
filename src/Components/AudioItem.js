import React, { useState, useEffect, useRef } from 'react'
import AudioEncoder from 'audio-encoder'
import AudioSample from './AudioSample'
import Waveform from './Waveform'
import { useAudioContainerStore } from '../GlobalState'

export default function AudioItem(props) {
    const [audioContext] = useState(() => new AudioContext({ sampleRate: 44100 }))
    const [audioBuffer, setAudioBuffer] = useState(null)
    const [trimInterval, setTrimInterval] = useState({ x1: 0, x2: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [posX, setPosX] = useState(0)
    const width = useAudioContainerStore(state => state.width)
    const oldWidth = useRef(0)
    const clickedX = useRef()
    const clickedPosX = useRef()

    useEffect(() => {
        if (!props.isTrimmingOn && props.isOkClicked) {
            trimAudioBuffer()
            setTrimInterval({ x1: 0, x2: 0})
        }
    }, [props.isTrimmingOn])

    useEffect(() => {
        if (width === 0) return
        const oWidth = oldWidth.current
        setPosX(prev => (oWidth / width) * prev)
        oldWidth.current = width
    }, [width])

    const setAudioSample = (sample) => {
        setAudioBuffer(sample)
        AudioEncoder(sample, 0, null, (blob) => {
            props.setAudioFileUrl(URL.createObjectURL(blob))
        })
    }

    const trimAudioBuffer = () => {
        const { numberOfChannels, length, sampleRate } = audioBuffer

        let { x1, x2 } = trimInterval
        if (x1 > x2) [x1, x2] = [x2, x1];
        [x1, x2] = [x1, x2].map(x => Math.trunc(x * length)) // convert from percentage to sample frame index

        const newAudioBuffer = audioContext.createBuffer(numberOfChannels, length - (x2-x1+1), sampleRate)
        for(let i = 0; i < numberOfChannels; i++) {
            let channelData = audioBuffer.getChannelData(i)
            let newChannelData = new Float32Array(length - (x2-x1+1))
            newChannelData.set(channelData.subarray(0, x1), 0) // [0, x1)
            newChannelData.set(channelData.subarray(x2 + 1), x1) // (x2, n]
            newAudioBuffer.copyToChannel(newChannelData, i)
        }
        setAudioSample(newAudioBuffer)
    }

    const handleDrag = (e) => {
        if (e.type === 'mousedown') {
            setIsDragging(true)
            clickedX.current = e.pageX
            clickedPosX.current = posX
        }
        else if (e.type === 'mouseup' && isDragging) setIsDragging(false)
    }

    const handleMouseClick = (e) => {
        if (!props.isTrimmingOn) {
            handleDrag(e)
            return
        }
        let key = ''
        let x = (e.pageX - e.target.offsetLeft) / e.target.scrollWidth
        if (e.type === 'mousedown') key = 'x1'
        else if (e.type === 'mouseup') key = 'x2'
        if (key !== '') setTrimInterval(prev => ({ ...prev, [key]: x }))
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        setPosX(Math.max(0, clickedPosX.current + (e.pageX - clickedX.current)))
    }

    return (
        <div 
            className="audio-item"
            onMouseMove={handleMouseMove}
        >
            <AudioSample 
                setAudioBuffer={setAudioSample}
                audioContext={audioContext}
                audioUrl={props.url}
            />
            <Waveform 
                posX={posX}
                audioBuffer={audioBuffer}
                audioContext={audioContext}
                isSamplePlaying={props.isSamplePlaying}
                onPlayFinish={props.onPlayFinish}
                onMouseDown={handleMouseClick}
                onMouseUp={handleMouseClick}
            />
        </div>
    )
}
/*
class AudioItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            audioContext: new AudioContext({
                sampleRate: 44100
            }),
            audioUrl: props.url,
            audioBuffer: null,
            trimInterval: {
                x1: 0,
                x2: 0
            },
            isDragging: false,
            posX: 0
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isTrimmingOn === true && this.props.isTrimmingOn === false) { // if trimming just turned off
            if (this.props.isOkClicked) this.trimAudioBuffer()
            else this.setState({
                trimInterval: {
                    x1: 0,
                    x2: 0
                }
            })
        }
    }

    setAudioBuffer = (sample) => {
        this.setState({
            audioBuffer: sample
        })
        AudioEncoder(sample, 0, null, (blob) => {
            this.props.setAudioFileUrl(URL.createObjectURL(blob))
        })
    }

    trimAudioBuffer = () => {
        const { numberOfChannels, length, sampleRate } = this.state.audioBuffer

        let { x1, x2 } = this.state.trimInterval
        if (x1 > x2) [x1, x2] = [x2, x1];
        [x1, x2] = [x1, x2].map(x => Math.trunc(x * length)) // convert from percentage to sample frame index

        const newAudioBuffer = this.state.audioContext.createBuffer(numberOfChannels, length - (x2-x1+1), sampleRate)
        for(let i = 0; i < numberOfChannels; i++) {
            let channelData = this.state.audioBuffer.getChannelData(i)
            let newChannelData = new Float32Array(length - (x2-x1+1))
            newChannelData.set(channelData.subarray(0, x1), 0) // [0, x1)
            newChannelData.set(channelData.subarray(x2 + 1), x1) // (x2, n]
            newAudioBuffer.copyToChannel(newChannelData, i)
        }
        this.setAudioBuffer(newAudioBuffer)
    }

    drag = (e) => {
        if (e.type === 'mousedown') this.setState({ isDragging: true })
        else if (e.type === 'mouseup' && this.state.isDragging) this.setState({ isDragging: false })
    }

    handleMouseClick = (e) => {
        if (!this.props.isTrimmingOn) {
            this.drag(e)
            return
        }
        let key = ''
        let x = (e.pageX - e.target.offsetLeft) / e.target.scrollWidth
        if (e.type === 'mousedown') key = 'x1'
        else if (e.type === 'mouseup') key = 'x2'
        if (key !== '') {
            this.setState(prevState => ({
                trimInterval: {
                    ...prevState.trimInterval,
                    [key]: x
                }
            }))
        }
    }

    handleMouseMove = (e) => {
        if (!this.state.isDragging) return
        this.setState({ posX: e.pageX })
    }

    render() {
        return (
            <div 
                className="audio-item"
                onMouseMove={this.handleMouseMove}
            >
                <AudioSample 
                    {...this.state}
                    setAudioBuffer={this.setAudioBuffer}/>
                <Waveform 
                    {...this.state}
                    posX={this.state.posX}
                    isSamplePlaying={this.props.isSamplePlaying}
                    onPlayFinish={this.props.onPlayFinish}
                    onMouseDown={this.handleMouseClick}
                    onMouseUp={this.handleMouseClick}/>
            </div>
        )
    }
}

export default AudioItem
*/