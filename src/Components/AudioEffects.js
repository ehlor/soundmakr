import React, { useState } from 'react'
import { Range, Direction } from 'react-range'
import { useAudioStore, useEffectsStore, useToolbarStore } from '../GlobalState'
import { FrequencyKnob, QKnob, GainKnob } from './Knob'
import shallow from 'zustand/shallow'
import styles from '../Styles/AudioEffects.module.css'

export default function AudioEffects() {
    const selectedAudio = useToolbarStore(state => state.selectedAudio)
    const effects = useEffectsStore(state => state.effects)

    return (
        effects.length > 0 && selectedAudio < effects.length &&
        <div id={styles.audioEffects}>
            <Gain />
            <div id={styles.filters}>
                <Filter type="lowpass" />
                <Filter type="highpass" />
                <Filter type="bandpass" />
                <Filter type="peaking" gainKnob={true} />
            </div>
        </div>
    )
}

function Filter({ type, gainKnob = false }) {
    const audioContext = useAudioStore(state => state.audioContext)
    const selectedAudio = useToolbarStore(state => state.selectedAudio)
    const [filter, updateFilter, toggleFilter] = useEffectsStore(state => [
        state.effects[selectedAudio][type], state.updateFilter, state.toggleFilter
    ], shallow)

    return (
        <div className={styles.filter}>
            <FilterToggle
                label={type}
                value={filter.on}
                handleChange={() => toggleFilter(selectedAudio, type, !filter.on, audioContext)}
            />
            <KnobPanel
                label="Freq"
                value={filter.frequency.value}
                unit="Hz"
            >
                <FrequencyKnob
                    rad={filter.frequency.rad}
                    callback={(value, rad) => updateFilter(selectedAudio, type, 'frequency', value, rad)}
                />
            </KnobPanel>
            <KnobPanel
                label="Q"
                value={filter.Q.value}
            >
                <QKnob
                    rad={filter.Q.rad}
                    callback={(value, rad) => updateFilter(selectedAudio, type, 'Q', value, rad)}
                />
            </KnobPanel>
            {gainKnob &&
                <KnobPanel
                    label="Gain"
                    value={filter.gain.value}
                    unit="dB"
                >
                    <GainKnob
                        rad={filter.gain.rad}
                        callback={(value, rad) => updateFilter(selectedAudio, type, 'gain', value, rad)}
                    />
                </KnobPanel>
            }
        </div>
    )
}

function KnobPanel({ label, value, unit, children }) {
    return (
        <div className={styles.knobPanel}>
            <div className={styles.knobContainer}>
                {children}
            </div>
            <div className={styles.infoContainer}>
                <p className={styles.label}>{label}</p>
                <p className={styles.value}>{Math.trunc(value)} {unit}</p>
            </div>
        </div>
    )
}

function FilterToggle({ label, value, handleChange }) {
    return (
        <div className={styles.togglePanel}>
            <p className={styles.label}>{label}</p>
            <div className={styles.toggle}>
                <input 
                    type="checkbox"
                    className={styles.filterCheckbox} 
                    id={label} 
                    checked={value} 
                    onChange={handleChange} 
                    hidden
                />
                <label 
                    htmlFor={label} 
                    className={styles.filterToggle}
                />
            </div>
        </div>
    )
}

function Gain() {
    const selectedAudio = useToolbarStore(state => state.selectedAudio)
    const [gain, setGain] = useEffectsStore(state => [state.effects[selectedAudio].gain, state.setGain], shallow)

    return (
        <div id={styles.gain}>
            <p className={styles.label}>Gain</p>
            <Range
                step={0.01}
                min={0}
                max={2}
                values={[gain]}
                onChange={(values) => setGain(values[0], selectedAudio)}
                direction={Direction.Up}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        id={styles.gainSliderTrack}
                        style={{'--size': `${gain/2*100}%`}}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        id={styles.gainSliderThumb}
                    />
                )}
            />
            <p>{Math.floor(gain * 100) / 100}</p>
        </div>
    )
}