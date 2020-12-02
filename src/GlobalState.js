import create from 'zustand'
import produce from 'immer'

const filterList = ['lowpass', 'highpass', 'bandpass', 'peaking']

export const useAudioStore = create(set => ({
    audioContext: new AudioContext({ sampleRate: 44100 }),
    audio: [],
    offset: 0,
    setAudio: (newAudio) => set({ audio: newAudio }),
    setOffset: (newOffset) => set({ offset: newOffset }),
    removeAudio: (id) => set(state => ({ audio: state.audio.filter((sound, index) => index !== id) }))
}))

export const useEffectsStore = create(set => ({
    nodes: [],
    effects: [],
    addEffects: (ctx) => set(produce(draft => {
        draft.effects.push({
            gain: 1,
            lowpass: {
                on: false,
                frequency: { value: 21.533203125, rad: 0 },
                Q: { value: 0.0001, rad: 0 }
            },
            highpass: {
                on: false,
                frequency: { value: 21.533203125, rad: 0 },
                Q: { value: 0.0001, rad: 0 }
            },
            bandpass: {
                on: false,
                frequency: { value: 21.533203125, rad: 0 },
                Q: { value: 0.0001, rad: 0 }
            },
            peaking: {
                on: false,
                frequency: { value: 21.533203125, rad: 0 },
                Q: { value: 0.0001, rad: 0 },
                gain: { value: 0, rad: 0 }
            }
        })
        const nodes = filterList.reduce((acc, filter) => {
            const node = ctx.createBiquadFilter()
            node.on = false
            node.type = filter
            node.frequency.value = 21.533203125
            node.Q.value = 0.0001
            if (filter === 'peaking') node.gain.value = 1
            return { ...acc, [filter]: node }
        }, {})
        const gain = ctx.createGain()
        gain.gain.value = 1
        nodes.gain = gain
        gain.connect(ctx.destination)
        draft.nodes.push(nodes)
    })),
    removeEffects: (id) => set(produce(draft => {
        draft.nodes.splice(id, 1)
        draft.effects.splice(id, 1)
    })),
    toggleFilter: (id, type, value, ctx) => set(produce(draft => {
        draft.effects[id][type].on = value
        draft.nodes[id][type].on = value
        Object.keys(draft.nodes[id]).forEach(node => draft.nodes[id][node].disconnect())
        let input = draft.nodes[id].gain
        filterList.forEach(filter => {
            if (draft.nodes[id][filter].on === true || (draft.nodes[id].type === type && value)) 
                input = input.connect(draft.nodes[id][filter])
        })
        input.connect(ctx.destination)
    })),
    updateFilter: (id, type, unit, value, rad) => set(produce(draft => {
        draft.effects[id][type][unit].value = value
        draft.effects[id][type][unit].rad = rad
        draft.nodes[id][type][unit].value = value
    })),
    setGain: (value, id) => set(produce(draft => {
        draft.effects[id].gain = value
        draft.nodes[id].gain.gain.value = value
    }))
}))

export const useAudioContainerStore = create(set => ({
    width: 0,
    trim: {
        id: 0,
        x1: 0,
        x2: 0
    },
    setWidth: (newWidth) => set(state => ({ 
        width: Math.max(newWidth, state.width)
    })),
    modifyWidth: (isUp) => set(state => {
        let width
        if (isUp) {
            if (state.width > 20) width = state.width - 10
            else width = (state.width / 2) < 0.5 ? state.width : state.width / 2
        } else {
            if (state.width > 10) width = state.width + 10
            else width = state.width * 2
        }
        return { width }
    }),
    setTrim: (id, x2, x1) => set(produce(draft => {
        draft.trim.id = id
        draft.trim.x2 = x2
        if (x1 !== undefined) draft.trim.x1 = x1
    })),
}))

export const useToolbarStore = create(set => ({
    isImportDialogOpen: false,
    isAllPlaying: false,
    isSamplePlaying: false,
    isTrimmingOn: false,
    isMovingOn: false,
    isOkClicked: false,
    selectedAudio: -1,
    setIsImportDialogOpen: (bool) => set({ isImportDialogOpen: bool }),
    setIsAllPlaying: (bool) => set({ isAllPlaying: bool }),
    setIsSamplePlaying: (bool) => set({ isSamplePlaying: bool }),
    setIsTrimmingOn: (bool) => set({ isTrimmingOn: bool, isMovingOn: false, isOkClicked: false }),
    setIsMovingOn: (bool) => set({ isMovingOn: bool, isTrimmingOn: false }),
    setIsOkClicked: (bool) => set({ isOkClicked: bool }),
    setSelectedAudio: (id) => set({ selectedAudio: id })
}))