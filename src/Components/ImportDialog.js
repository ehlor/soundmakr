import React, { useState, useRef } from 'react'
import Shiitake from 'shiitake';
import { Scrollbar } from 'react-scrollbars-custom'
import SearchIconRounded from '@material-ui/icons/SearchRounded'
import AddIconRounded from '@material-ui/icons/AddRounded'
import PlayArrowIconRounded from '@material-ui/icons/PlayArrowRounded'

import useCloseFromOutside from '../Hooks/useCloseFromOutside'
import SimpleWaveform from './SimpleWaveform'
import useImportSound from '../Hooks/useImportSound'
import Button from './Button'
import styles from '../Styles/ImportDialog.module.css'

const api_key = 'FUeslAUEuFkf1OlIlqqLJmkOW6Cw4sQ3oKM2PtsQ'

function SearchContainer({ searchSounds }) {
    const [query, setQuery] = useState('')
    const url = `https://freesound.org/apiv2/search/text/?format=json&query=${query}&filter=license:"Creative Commons 0"&fields=name,description,samplerate,duration,previews&token=${api_key}`

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') searchSounds(url)
    }

    return (
        <div id={styles.searchContainer}>
            <input 
                className={styles.searchbar}
                type="text"
                placeholder="Search for sounds..."
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={handleEnterPress}
            />
            <div 
                className={styles.searchButton}
                onClick={() => searchSounds(url)}
            >
                <SearchIconRounded />
            </div>
        </div>
    )
}

function SoundList({ sounds, closeDialog }) {
    const [play, setPlay] = useState({ id: -1, state: false })
    const importSound = useImportSound()

    const handlePlay = (event, index) => {
        event.stopPropagation()
        if (play.id === index) setPlay(prev => { return { ...play, state: !prev.state }})
        else {
            setPlay({ ...play, state: false })
            setPlay({ id: index, state: true })
        }
    }

    const handleClick = async (index) => {
        await importSound(sounds[index].previews['preview-hq-mp3'])
        closeDialog()
    }

    return (
        <ol className={styles.soundList}>
            {sounds?.map((sound, index) => (
                <li 
                    className={styles.soundInfo}
                    key={index} 
                >
                    <p>{Math.trunc(sound.duration * 10) / 10} s</p>
                    <div className={styles.soundNameDescription}>
                        <p>{sound.name}</p>
                        <Shiitake
                            lines={2}
                            tagName="p"
                        >
                            {sound.description.replace(/(<([^>]+)>)/gi, '')}
                        </Shiitake>
                    </div>
                    <SimpleWaveform 
                        url={sound.previews['preview-hq-mp3']} 
                        play={index === play.id ? play.state : false} 
                        setPlay={setPlay}
                    />
                    <div className={styles.buttonContainer}>
                        <Button 
                            className={styles.button}
                            onClick={(e) => handlePlay(e, index)}
                        >
                            <PlayArrowIconRounded />
                        </Button>
                        <Button 
                            className={styles.button}
                            onClick={() => handleClick(index)}
                        >
                            <AddIconRounded />
                        </Button>
                    </div>
                </li>
            ))}
        </ol>
    )
}

export default function ImportDialog({ onDialogClose }) {
    const [sounds, setSounds] = useState(null)
    const ref = useCloseFromOutside(onDialogClose)
    const scrollRef = useRef()

    const searchSounds = async (url) => {
        try{
            const res = await fetch(url)
            const data = await res.json()
            setSounds(data)
            scrollRef.current.scrollToTop()
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div id={styles.importDialogBackground}>
            <div id={styles.importDialog} ref={ref}>
                <Scrollbar 
                    className={styles.scrollbar}
                    ref={scrollRef}    
                >
                    <SearchContainer searchSounds={searchSounds} />
                    <SoundList 
                        sounds={sounds?.results}
                        closeDialog={onDialogClose}
                    />
                    <div className={styles.navButtonContainer}>
                        {sounds !== null && sounds.previous !== null && 
                            <Button 
                                className={styles.navButton}
                                onClick={() => searchSounds(sounds.previous + `&token=${api_key}`)}
                            >
                                PREV
                            </Button>
                        }
                        {sounds !== null && sounds.next !== null && 
                            <Button 
                                className={styles.navButton}
                                onClick={() => searchSounds(sounds.next + `&token=${api_key}`)}
                            >
                                NEXT
                            </Button>
                        }
                    </div>
                </Scrollbar>
            </div>
        </div>
        
    )
}