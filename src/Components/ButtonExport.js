import React from 'react'

export default function ButtonExport({ audioFileUrl, audioFileFormat }) {

    const handleClick = () => {
        const date = new Date().toJSON().slice(0, 19).replace('T', '--').replace(/:/g, '-')
        let a = document.createElement('a')
        a.href = audioFileUrl
        a.download = `${date}${audioFileFormat}`
        a.click()
    }

    return <button onClick={handleClick}>Export</button>
}