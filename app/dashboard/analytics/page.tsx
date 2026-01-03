import { BarChart2 } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-medium mb-1">Analytics</h1>
                <p className="text-gray-500">Track your portfolio performance</p>
            </div>

            <div className="card p-12 text-center">
                <BarChart2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">Coming Soon</h2>
                <p className="text-gray-500">
                    Analytics dashboard is under development. Check back soon!
                </p>
            </div>
        </>
    )
}
