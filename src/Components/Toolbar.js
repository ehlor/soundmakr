import React from 'react'
import shallow from 'zustand/shallow'
import SearchIconRounded from '@material-ui/icons/SearchRounded'
import AddIconRounded from '@material-ui/icons/AddRounded'
import PlaylistPlayIconRounded from '@material-ui/icons/PlaylistPlayRounded'
import PlayArrowIconRounded from '@material-ui/icons/PlayArrowRounded'
import OpenWithIconRounded from '@material-ui/icons/OpenWithRounded'
import CheckIconRounded from '@material-ui/icons/CheckRounded'
import ClearIconRounded from '@material-ui/icons/ClearRounded'
import SaveAltIconRounded from '@material-ui/icons/SaveAltRounded'
import DeleteForeverIconRounded from '@material-ui/icons/DeleteForeverRounded'
import createSvgIcon from "@material-ui/icons/utils/createSvgIcon";

import Button from './Button'
import FormatSelector from './FormatSelector'
import ButtonImportFromPC from './ButtonImportFromPC'
import ButtonExport from './ButtonExport'
import ButtonRemove from './ButtonRemove'
import { useToolbarStore } from '../GlobalState'
import styles from '../Styles/Toolbar.module.css'

const ContentCutIconRounded = createSvgIcon(
    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" />,
    "ContentCutRounded"
)

export default function Toolbar({ audioFileFormat, setAudioFileFormat }) {
    const setIsImportDialogOpen = useToolbarStore(state => state.setIsImportDialogOpen)
    const [isAllPlaying, setIsAllPlaying] = useToolbarStore(state => [state.isAllPlaying, state.setIsAllPlaying], shallow)
    const [isSamplePlaying, setIsSamplePlaying] = useToolbarStore(state => [state.isSamplePlaying, state.setIsSamplePlaying], shallow)
    const [isTrimmingOn, setIsTrimmingOn] = useToolbarStore(state => [state.isTrimmingOn, state.setIsTrimmingOn], shallow)
    const [isMovingOn, setIsMovingOn] = useToolbarStore(state => [state.isMovingOn, state.setIsMovingOn], shallow)
    const setIsOkClicked = useToolbarStore(state => state.setIsOkClicked)

    const handleTrimFinished = (isOkClicked) => {
        setIsTrimmingOn(false)
        setIsOkClicked(isOkClicked)
    }

    return (
        <div id={styles.toolbar}>
            <div id={styles.appName}>SOUNDMAKR</div>
            <div id={styles.toolContainer}>
                <div>
                    <Button 
                        className={styles.button}
                        title="Search"
                        onClick={() => setIsImportDialogOpen(true)}
                    >
                        <SearchIconRounded />
                    </Button>
                    <ButtonImportFromPC className={styles.button}>
                        <AddIconRounded />
                    </ButtonImportFromPC>
                    <ButtonExport 
                        className={styles.button}
                        audioFileFormat={audioFileFormat}
                    >
                        <SaveAltIconRounded />
                    </ButtonExport>
                </div>
                <div>
                    <Button 
                        className={styles.button}
                        title="Play All"
                        onClick={() => setIsAllPlaying(!isAllPlaying)}
                        isOn={isAllPlaying}
                    >
                        <PlaylistPlayIconRounded />
                    </Button>
                    <Button 
                        className={styles.button}
                        title="Play"
                        onClick={() => setIsSamplePlaying(!isSamplePlaying)}
                        isOn={isSamplePlaying}
                    >
                        <PlayArrowIconRounded />
                    </Button>
                </div>
                <div id={styles.editContainer}>
                    <Button 
                        className={styles.button}
                        title="Trim"
                        onClick={() => setIsTrimmingOn(!isTrimmingOn)}
                        isOn={isTrimmingOn}
                    >
                        <ContentCutIconRounded />
                    </Button>
                    <Button 
                        className={styles.button}
                        title="Move"
                        onClick={() => setIsMovingOn(!isMovingOn)}
                        isOn={isMovingOn}
                    >
                        <OpenWithIconRounded />
                    </Button>
                    <ButtonRemove className={styles.button}>
                        <DeleteForeverIconRounded />
                    </ButtonRemove>
                </div>
                <FormatSelector 
                    audioFileFormat={audioFileFormat}
                    setAudioFileFormat={setAudioFileFormat}
                />
                <div>
                    {isTrimmingOn && 
                        <Button 
                            className={styles.button}
                            title="Accept"
                            onClick={() => handleTrimFinished(true)}
                        >
                            <CheckIconRounded />
                        </Button>
                    }
                    {isTrimmingOn && 
                        <Button 
                            className={styles.button}
                            title="Cancel"
                            onClick={() => handleTrimFinished(false)}
                        >
                            <ClearIconRounded />
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}