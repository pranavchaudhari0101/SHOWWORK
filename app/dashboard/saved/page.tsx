import { Bookmark } from 'lucide-react'

export default function SavedPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-medium mb-1">Saved Projects</h1>
                <p className="text-gray-500">Projects you&apos;ve bookmarked</p>
            </div>

            <div className="card p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">No saved projects</h2>
                <p className="text-gray-500">
                    When you save projects, they&apos;ll appear here for easy access.
                </p>
            </div>
        </>
    )
}
