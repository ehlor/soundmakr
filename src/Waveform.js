import React, {Component} from 'react'
import WaveSurfer from 'wavesurfer.js'

class Waveform extends Component {
    constructor() {
        super()
        this.waveformRef = React.createRef()
    }

    componentDidMount() {
        this.wavesurfer = WaveSurfer.create({
            container: this.waveformRef.current,
            barWidth: 2,
            audioContext: this.props.audioContext
        })
        this.wavesurfer.on('finish', () => {
            this.props.onPlayFinish()
        })
    }

    componentWillUnmount() {
        this.wavesurfer.destroy()
    }

    componentDidUpdate(prevProps) {
        if(prevProps.audioBuffer !== this.props.audioBuffer) {
            this.wavesurfer.loadDecodedBuffer(this.props.audioBuffer)
        }
    }

    play = () => {
        if(this.wavesurfer === undefined) return
        if(this.props.isSamplePlaying) this.wavesurfer.play()
        else this.wavesurfer.pause()
    }

    render() {
        this.play()
        return <div 
            ref={this.waveformRef} 
            onMouseDown={this.props.onMouseDown}
            onMouseUp={this.props.onMouseUp}/>
    }
}

export default Waveform