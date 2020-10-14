import React, { useEffect, useRef } from 'react'

export default function useCloseFromOutside(onClose) {
    const ref = useRef()

    useEffect(() => {
        const close = (e) => {
            if (ref.current?.contains(e.target)) return
            onClose()
        }
        document.body.addEventListener('click', close)
        return () => document.body.removeEventListener('click', close)
    }, [onClose])

    return ref
}