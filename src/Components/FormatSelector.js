import React, { useState } from 'react'
import useCloseFromOutside from '../Hooks/useCloseFromOutside'
import styles from '../Styles/Toolbar.module.css'

export default function FormatSelector({ audioFileFormat, setAudioFileFormat }) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useCloseFromOutside(() => setIsOpen(false))

    return (
        <div 
            className={`${styles.formatSelector} ${styles.format}`}
            onClick={() => setIsOpen(prev => !prev)}
            ref={ref}
        >
            {audioFileFormat}
            {isOpen &&
                <ol 
                    className={`${styles.formatOptions} ${styles.format}`}
                    onClick={(e) => setAudioFileFormat(e.target.innerHTML)}
                >
                    <li>.wav</li>
                    <li>.mp3</li>
                </ol>
            }
        </div>
    )
}