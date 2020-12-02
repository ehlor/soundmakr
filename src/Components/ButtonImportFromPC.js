import React from 'react'

import useImportSound from '../Hooks/useImportSound'
import styles from '../Styles/Button.module.css'

export default function ButtonImportFromPC({ className, children }) {
    const importSound = useImportSound()

    const importFile = async (e) => {
        if (e.target.files[0] === undefined) return
        const url = URL.createObjectURL(e.target.files[0])
        importSound(url)
        e.target.value = ''
    }

    return (
        <div>
            <input 
                id="addFile"
                type="file" 
                accept=".wav,.mp3"
                onChange={importFile}
                hidden
            />
            <label htmlFor="addFile" className={`${styles.button} ${className}`} title="Add">
                {children}
            </label>
        </div>
    )
}