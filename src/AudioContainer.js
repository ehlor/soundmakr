import React, {Component} from 'react'
import AudioItem from './AudioItem'

class AudioContainer extends Component {
    render() {
        return (
            <div id="audio-container">
                <AudioItem 
                    isSamplePlaying={this.props.isSamplePlaying}
                    onPlayFinish={this.props.onPlayFinish}
                    setAudioFileUrl={this.props.setAudioFileUrl}
                    isTrimmingOn={this.props.isTrimmingOn}
                    isOkClicked={this.props.isOkClicked}/>
            </div>
        )
    }
}

export default AudioContainer