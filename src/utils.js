export function getDelayFromClick(posX, containerRef, widthInSec) {
    const screenToFullRatio = containerRef.current.clientWidth / containerRef.current.scrollWidth
    const clickedToFullRatio = posX / containerRef.current.scrollWidth
    return clickedToFullRatio / screenToFullRatio * widthInSec
}

export function getOffsetFromClick() {

}