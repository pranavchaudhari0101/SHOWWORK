import Navbar from '@/components/Navbar'

export default function ProjectLoading() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-4xl">
                    {/* Breadcrumb Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-5 w-32 bg-gray-800/50 rounded animate-pulse" />
                    </div>

                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-10 w-3/4 bg-gray-800 rounded animate-pulse mb-3" />
                        <div className="h-6 w-1/2 bg-gray-800/50 rounded animate-pulse" />
                    </div>

                    {/* Cover Image Skeleton */}
                    <div className="aspect-video w-full rounded-xl bg-gray-800 animate-pulse mb-8" />

                    {/* Actions Skeleton */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-800">
                        <div className="flex gap-2">
                            <div className="h-10 w-20 bg-gray-800 rounded animate-pulse" />
                            <div className="h-10 w-20 bg-gray-800 rounded animate-pulse" />
                            <div className="h-10 w-10 bg-gray-800 rounded animate-pulse" />
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
                            <div className="h-10 w-28 bg-gray-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Content Grid Skeleton */}
                    <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2">
                            <div className="h-7 w-48 bg-gray-800 rounded animate-pulse mb-6" />
                            <div className="space-y-3">
                                <div className="h-5 w-full bg-gray-800/50 rounded animate-pulse" />
                                <div className="h-5 w-full bg-gray-800/50 rounded animate-pulse" />
                                <div className="h-5 w-3/4 bg-gray-800/50 rounded animate-pulse" />
                                <div className="h-5 w-full bg-gray-800/50 rounded animate-pulse" />
                                <div className="h-5 w-2/3 bg-gray-800/50 rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Author Card Skeleton */}
                            <div className="card p-5">
                                <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse mb-4" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                                    <div>
                                        <div className="h-5 w-24 bg-gray-800 rounded animate-pulse mb-1" />
                                        <div className="h-4 w-16 bg-gray-800/50 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack Skeleton */}
                            <div className="card p-5">
                                <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse mb-4" />
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-7 w-16 bg-gray-800 rounded-full animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            {/* Stats Skeleton */}
                            <div className="card p-5">
                                <div className="h-3 w-12 bg-gray-800/50 rounded animate-pulse mb-4" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex justify-between py-1">
                                            <div className="h-4 w-16 bg-gray-800/50 rounded animate-pulse" />
                                            <div className="h-4 w-8 bg-gray-800 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
