import create from 'zustand'

export const useAudioContainerStore = create(set => ({
    width: 0,
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
    })
}))

export const useToolbarStore = create(set => ({
    isImportDialogOpen: false,
    isSamplePlaying: false,
    isTrimmingOn: false,
    isMovingOn: false,
    isOkClicked: false,
    selectedAudio: -1,
    setIsImportDialogOpen: (bool) => set({ isImportDialogOpen: bool }),
    setIsSamplePlaying: (bool) => set({ isSamplePlaying: bool }),
    setIsTrimmingOn: (bool) => set({ isTrimmingOn: bool }),
    setIsMovingOn: (bool) => set({ isMovingOn: bool }),
    setIsOkClicked: (bool) => set({ isOkClicked: bool }),
    setSelectedAudio: (id) => set({ selectedAudio: id })
}))