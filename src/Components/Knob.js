import React, { useRef, useState } from 'react'
import styles from '../Styles/Knob.module.css'

function Knob({ func, offset, rad }) {
    const ref = useRef()
    const [isClicked, setIsClicked] = useState(false)

    const handleMouseMove = (e, clicked = false) => {
        e.stopPropagation()
        if (isClicked || clicked) {
            const [oX, oY] = [ref.current.offsetLeft, ref.current.offsetTop]
            const [rX, rY] = [e.pageX - oX, e.pageY - oY] // relative to top left
            const [nX, nY] = [(rX / ref.current.clientHeight * 2) - 1, 
                ((rY / ref.current.clientHeight * 2) - 1) * -1]// normalized to [-1, 1], flipped Y
            func(nX, nY)
        }
    }

    const handleMouseDown = (e) => {
        e.stopPropagation()
        setIsClicked(true)
        handleMouseMove(e, true)
    }

    return (
        <div 
            className={styles.knob}
            style={{
                borderRadius: '50%',
                transform: `rotate(${offset}deg)`
            }}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={() => setIsClicked(false)}
        >
            <div
                className="indicatorContainer"
                style={{
                    width: 'inherit',
                    height: 'inherit',
                    paddingTop: 4,
                    transform: `rotate(${rad}rad)`,
                    boxSizing: 'border-box'
                }}
            >
                <div 
                    className={styles.indicator}
                    style={{
                        width: '10%',
                        height: '30%',
                        borderRadius: 2,
                        margin: '0 auto'
                    }}
                />
            </div>
        </div>
    )
}

function CenterKnob({ callback, rad }) {
    const func = (nX, nY) => {
        let radians = Math.atan2(nX, nY) // 0 is up
        radians = Math.min(Math.max(radians, -3*Math.PI/4), 3*Math.PI/4) // clamp to [-225, 255] deg
        callback(radians / (3*Math.PI/4), radians) // return normalized values [-1, 1] & radians
    }
    return <Knob func={func} offset={0} rad={rad} />
}

function LeftKnob({ callback, rad }) {
    const func = (nX, nY) => {
        let radians = 2*Math.PI - ((Math.atan2(nY, nX) + (3*Math.PI/4) + (2*Math.PI)) % (2*Math.PI)) // converts to [0, 2PI] clockwise and applies offset
        radians = radians > 7*Math.PI/4 ?  0 : radians > 3*Math.PI/2 ? 3*Math.PI/2 : radians // clamping so 270-360 is unusable
        callback(radians / (3*Math.PI/2), radians) // return normalized values [0, 1] & radians
    }
    return <Knob func={func} offset={225} rad={rad} />
}

// [21.533203125, 22050] Hz
export function FrequencyKnob({ callback, rad }) {
    const normalizedToFreq = (value, rad) => {
        const baseValue = 21.533203125
        const index = Math.trunc(value / 0.1)
        const freq = (baseValue * (2 ** index)) * (1 + (value - (index / 10)) * 10)
        callback(freq, rad)
    }
    return <LeftKnob callback={normalizedToFreq} rad={rad} />
}

// [0.0001, 1000]
export function QKnob({ callback, rad }) {
    const normalizedToQ = (value, rad) => {
        const q = value * 99.9999 + 0.0001
        callback(q, rad)
    }
    return <LeftKnob callback={normalizedToQ} rad={rad} />
}

// [-40, 40] dB
export function GainKnob({ callback, rad }) {
    const normalizedToGain = (value, rad) => {
        const gain = value * 40
        callback(gain, rad)
    }
    return <CenterKnob callback={normalizedToGain} rad={rad} />
}