import React, {Component} from 'react'
import AudioEncoder from 'audio-encoder'
import AudioSample from './AudioSample'
import Waveform from './Waveform'

class AudioItem extends Component {
    constructor() {
        super()
        this.state = {
            audioContext: new AudioContext({
                sampleRate: 44100
            }),
            audioUrl: 'https://freesound.org/data/previews/463/463395_9658839-lq.mp3',
            audioBuffer: null,
            trimInterval: {
                x1: 0,
                x2: 0
            }
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

    handleMouseClick = (e) => {
        if (!this.props.isTrimmingOn) return
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

    render() {
        return (
            <div className="audio-item">
                <AudioSample 
                    {...this.state}
                    setAudioBuffer={this.setAudioBuffer}/>
                <Waveform 
                    {...this.state}
                    isSamplePlaying={this.props.isSamplePlaying}
                    onPlayFinish={this.props.onPlayFinish}
                    onMouseDown={this.handleMouseClick}
                    onMouseUp={this.handleMouseClick}/>
            </div>
        )
    }
}

export default AudioItem