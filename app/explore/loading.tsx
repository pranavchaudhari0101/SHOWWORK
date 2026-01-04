import Navbar from '@/components/Navbar'

export default function ExploreLoading() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container">
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="h-9 w-48 bg-gray-800 rounded animate-pulse mb-2" />
                            <div className="h-5 w-72 bg-gray-800/50 rounded animate-pulse" />
                        </div>
                        <div className="h-10 w-80 bg-gray-800 rounded-lg animate-pulse" />
                    </div>

                    {/* Projects Grid Skeleton */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card overflow-hidden">
                                {/* Cover Image Skeleton */}
                                <div className="aspect-video bg-gray-800 animate-pulse" />

                                {/* Content Skeleton */}
                                <div className="p-4">
                                    <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse mb-2" />
                                    <div className="h-4 w-full bg-gray-800/50 rounded animate-pulse mb-1" />
                                    <div className="h-4 w-2/3 bg-gray-800/50 rounded animate-pulse mb-3" />

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse" />
                                            <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse" />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-4 w-8 bg-gray-800/50 rounded animate-pulse" />
                                            <div className="h-4 w-8 bg-gray-800/50 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}
