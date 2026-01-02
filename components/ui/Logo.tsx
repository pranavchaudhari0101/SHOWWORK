import Image from 'next/image'
import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <Image
                src="/logo.png"
                alt="ShowWork"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
            />
        </Link>
    )
}
