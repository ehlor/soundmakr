import React, {Component} from 'react'

class AudioSample extends Component {

    componentDidMount() {
        this.getSample(this.props.audioContext, this.props.audioUrl)
            .then(sample => {
                this.props.setAudioBuffer(sample)
                this.connectSample(this.props.audioContext, sample)
            })
    }

    getSample = async (audioContext, filepath) => {
        let audioBuffer
        try {
            const response = await fetch(filepath)
            const arrayBuffer = await response.arrayBuffer()
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
            //console.log(audioBuffer.getChannelData(0))
        } catch(err) {
            console.error(err)
        }
        return audioBuffer
    }

    connectSample = (audioContext, sample) => {
        const sampleSource = audioContext.createBufferSource()
        sampleSource.buffer = sample
        sampleSource.connect(audioContext.destination)
        //sampleSource.start()
    }

    render() {
        return <div />
    }
}

export default AudioSample