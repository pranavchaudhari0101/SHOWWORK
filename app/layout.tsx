import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SilkBackground from '@/components/SilkBackground'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: {
        default: 'ShowWork - Showcase Your Projects, Get Discovered',
        template: '%s | ShowWork',
    },
    description: 'The portfolio platform for ambitious students. Showcase projects, share code, and get discovered by top companies.',
    keywords: ['portfolio', 'projects', 'students', 'developers', 'showcase', 'hiring'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="font-sans">
                <SilkBackground />
                {children}
            </body>
        </html>
    )
}

