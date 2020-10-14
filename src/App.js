import React, { useState } from 'react'
import ImportDialog from './ImportDialog'
import AudioContainer from './AudioContainer'
import FormatSelector from './Components/FormatSelector'
import ButtonExport from './Components/ButtonExport'

export default function App() {
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [isSamplePlaying, setIsSamplePlaying] = useState(false)
    const [isTrimmingOn, setIsTrimmingOn] = useState(false)
    const [isOkClicked, setIsOkClicked] = useState(false)
    const [audioFileUrl, setAudioFileUrl] = useState(null)
    const [audioFileFormat, setAudioFileFormat] = useState('.wav')

    const handleTrimFinished = (isOkClicked) => {
        setIsTrimmingOn(false)
        setIsOkClicked(isOkClicked)
    }

    return (
        <div className="app">
            <div id="toolbar">
                <h1 className="app-name">Sound Maker</h1>
                <div id="tool-container">
                    <button onClick={() => setIsImportDialogOpen(true)}>Web</button>
                    <button>PC</button>
                    <button onClick={() => setIsSamplePlaying(prev => !prev)}>Play</button>
                    <button onClick={() => setIsTrimmingOn(prev => !prev)}>Trim</button>
                    <FormatSelector 
                        audioFileFormat={audioFileFormat}
                        setAudioFileFormat={setAudioFileFormat}
                    />
                    <ButtonExport 
                        audioFileUrl={audioFileUrl}
                        audioFileFormat={audioFileFormat}
                    />
                    {isTrimmingOn && <button onClick={() => handleTrimFinished(true)}>Ok</button>}
                    {isTrimmingOn && <button onClick={() => handleTrimFinished(false)}>Cancel</button>}
                </div>
            </div>
            {isImportDialogOpen && <ImportDialog onDialogClose={() => setIsImportDialogOpen(false)}/>}
            <AudioContainer
                onPlayFinish={() => setIsSamplePlaying(false)}
                setAudioFileUrl={setAudioFileUrl} 
                isSamplePlaying={isSamplePlaying}
                isTrimmingOn={isTrimmingOn}
                isOkClicked={isOkClicked}
            />
        </div>
    )
}