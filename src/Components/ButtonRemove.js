import React from 'react'

import Button from './Button'
import { useAudioStore, useEffectsStore, useToolbarStore } from '../GlobalState'

export default function ButtonRemove({ className, children }) {
    const selectedAudio = useToolbarStore(state => state.selectedAudio)
    const removeEffects = useEffectsStore(state => state.removeEffects)
    const removeAudio = useAudioStore(state => state.removeAudio)

    const handleClick = () => {
        removeEffects(selectedAudio)
        removeAudio(selectedAudio)
    }

    return (
        <Button 
            className={className}
            onClick={handleClick}
            title="Remove"
        >
            {children}
        </Button>
    )
}