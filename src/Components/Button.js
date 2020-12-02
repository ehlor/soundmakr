import React from 'react'
import styles from '../Styles/Button.module.css'

export default function Button({ className, title, onClick, isOn, children }) {
    return (
        <div 
            className={`${styles.button} ${className}`}
            title={title}
            onClick={onClick}
            style={isOn ? { backgroundColor: '#1d98fd' } : {}}
        >
            {children}
        </div>
    )
}
