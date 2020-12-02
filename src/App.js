import React, { useState } from 'react'
import shallow from 'zustand/shallow'

import ImportDialog from './Components/ImportDialog'
import AudioContainer from './Components/AudioContainer'
import Toolbar from './Components/Toolbar'
import { useToolbarStore } from './GlobalState'
import AudioEffects from './Components/AudioEffects'
import styles from './Styles/App.module.css'

export default function App() {
    const [isImportDialogOpen, setIsImportDialogOpen] = useToolbarStore(state => [
        state.isImportDialogOpen, state.setIsImportDialogOpen
    ], shallow)
    const [audioFileFormat, setAudioFileFormat] = useState('.wav')

    return (
        <div id={styles.app}>
            <Toolbar 
                audioFileFormat={audioFileFormat}
                setAudioFileFormat={setAudioFileFormat}
            />
            {isImportDialogOpen && 
                <ImportDialog 
                    onDialogClose={() => setIsImportDialogOpen(false)}
                />
            }
            <AudioContainer />
            <AudioEffects />
        </div>
    )
}