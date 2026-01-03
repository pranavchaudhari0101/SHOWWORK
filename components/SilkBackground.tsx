'use client'

import dynamic from 'next/dynamic'

// Dynamically import Silk to avoid SSR issues with Three.js
const Silk = dynamic(() => import('./Silk'), { ssr: false })

export default function SilkBackground() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        >
            <Silk
                speed={1.5}
                scale={0.5}
                color="#1a191a"
                noiseIntensity={1.4}
                rotation={0.3}
            />
        </div>
    )
}
