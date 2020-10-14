import React, { useState } from 'react'
import useCloseFromOutside from './Hooks/useCloseFromOutside'
import SimpleWaveform from './SimpleWaveform'

const api_key = 'FUeslAUEuFkf1OlIlqqLJmkOW6Cw4sQ3oKM2PtsQ'

function SearchContainer({ setSounds }) {
    const [query, setQuery] = useState('')

    const searchSounds = async () => {
        try{
            const res = await fetch(`https://freesound.org/apiv2/search/text/?format=json&query=${query}&filter=license:"Creative Commons 0"&fields=name,description,samplerate,duration,previews&token=${api_key}`)
            const data = await res.json()
            console.log(data)
            setSounds(data)
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div id="search-container">
            <input 
                className="searchbar" 
                type="text"
                onChange={(e) => setQuery(e.target.value)} 
            />
            <button 
                className="button-search"
                onClick={searchSounds}
            >
                Search
            </button>
        </div>
    )
}

function SoundList({ sounds }) {
    const [play, setPlay] = useState({ id: -1, state: false })

    const handlePlay = (event, index) => {
        event.stopPropagation()
        if (play.id === index) setPlay(prev => { return { ...play, state: !prev.state }})
        else {
            setPlay({ ...play, state: false })
            setPlay({ id: index, state: true })
        }
    }

    return (
        <ol className="sound-list">
            {sounds?.map((sound, index) => (
                <li key={index} >
                    <p>{sound.duration}</p>
                    <p>{sound.name}</p>
                    <p>{sound.description}</p>
                    <SimpleWaveform 
                        url={sound.previews['preview-hq-mp3']} 
                        play={index === play.id ? play.state : false} 
                        setPlay={setPlay}
                    />
                    <button onClick={(e) => handlePlay(e, index)}>Play</button>
                </li>
            ))}
        </ol>
    )
}

export default function ImportDialog({ onDialogClose }) {
    const [sounds, setSounds] = useState(null)
    const ref = useCloseFromOutside(onDialogClose)

    return (
        <div id="import-dialog" ref={ref}>
            <SearchContainer setSounds={setSounds} />
            <SoundList sounds={sounds?.results} />
        </div>
    )
}