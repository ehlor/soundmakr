import React, { useState } from 'react'
import useCloseFromOutside from '../Hooks/useCloseFromOutside'

export default function FormatSelector({ audioFileFormat, setAudioFileFormat }) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useCloseFromOutside(() => setIsOpen(false))

    return (
        <div 
            className="format-selector" 
            onClick={() => setIsOpen(prev => !prev)}
            ref={ref}>
            {audioFileFormat}
            {isOpen &&
                <ol onClick={(e) => setAudioFileFormat(e.target.innerHTML)}>
                    <li>.wav</li>
                    <li>.mp3</li>
                </ol>
            }
        </div>
    )
}