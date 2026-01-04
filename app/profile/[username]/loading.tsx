import { Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Loading() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
            </main>
        </>
    )
}
