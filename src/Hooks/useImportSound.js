import shallow from "zustand/shallow";
import { useAudioStore, useEffectsStore, useToolbarStore } from "../GlobalState";

export default function useImportSound() {
    const [audioContext, audio, setAudio] = useAudioStore(state => [
        state.audioContext, state.audio, state.setAudio
    ], shallow)
    const setSelectedAudio = useToolbarStore(state => state.setSelectedAudio)
    const addEffects = useEffectsStore(state => state.addEffects)

    const getAudioBuffer = async (url) => {
        let audioBuffer
        try {
            const response = await fetch(url)
            const arrayBuffer = await response.arrayBuffer()
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        } catch(err) {
            console.error(err)
        }
        return audioBuffer
    }
    
    const setGlobalAudioState = async (url) => {
        const audioBuffer = await getAudioBuffer(url)
        const newAudio = [...audio, { audioBuffer, delay: 0 }]
        setSelectedAudio(audio.length)
        addEffects(audioContext)
        setAudio(newAudio)
    }

    return setGlobalAudioState
}