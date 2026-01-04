
export default function ProjectsLoading() {
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="h-8 w-40 bg-gray-800 rounded animate-pulse mb-2" />
                    <div className="h-4 w-56 bg-gray-800/50 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-gray-800 rounded animate-pulse" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg animate-pulse" />
                            <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse" />
                        </div>
                        <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse mb-2" />
                        <div className="h-4 w-full bg-gray-800/50 rounded animate-pulse mb-4" />
                        <div className="flex gap-2">
                            <div className="h-8 flex-1 bg-gray-800 rounded animate-pulse" />
                            <div className="h-8 flex-1 bg-gray-800 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
