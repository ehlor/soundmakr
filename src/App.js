import React, { useState } from 'react'
import ImportDialog from './Components/ImportDialog'
import AudioContainer from './Components/AudioContainer'
import FormatSelector from './Components/FormatSelector'
import ButtonExport from './Components/ButtonExport'
import { useToolbarStore } from './GlobalState'
import shallow from 'zustand/shallow'

export default function App() {
    const [isImportDialogOpen, setIsImportDialogOpen] = useToolbarStore(state => [state.isImportDialogOpen, state.setIsImportDialogOpen], shallow)
    const [isSamplePlaying, setIsSamplePlaying] = useToolbarStore(state => [state.isSamplePlaying, state.setIsSamplePlaying], shallow)
    const [isTrimmingOn, setIsTrimmingOn] = useToolbarStore(state => [state.isTrimmingOn, state.setIsTrimmingOn], shallow)
    const [isOkClicked, setIsOkClicked] = useToolbarStore(state => [state.isOkClicked, state.setIsOkClicked], shallow)
    const [audioFileUrl, setAudioFileUrl] = useState(null)
    const [audioFileFormat, setAudioFileFormat] = useState('.wav')
    const [audioFiles, setAudioFiles] = useState([])

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
            {isImportDialogOpen && 
                <ImportDialog 
                    onDialogClose={() => setIsImportDialogOpen(false)}
                    setAudioFiles={setAudioFiles}
                />
            }
            <AudioContainer
                audioFiles={audioFiles}
                onPlayFinish={() => setIsSamplePlaying(false)}
                setAudioFileUrl={setAudioFileUrl} 
                isSamplePlaying={isSamplePlaying}
                isTrimmingOn={isTrimmingOn}
                isOkClicked={isOkClicked}
            />
        </div>
    )
}