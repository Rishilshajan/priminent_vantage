interface SimulationsStatsProps {
    stats: {
        totalEnrollments: number
        activeSimulations: number
        completionRate: number
        skillsAssessed: number
    }
}

export default function SimulationsStats({ stats }: SimulationsStatsProps) {
    const statCards = [
        {
            label: "Total Enrollments",
            value: stats.totalEnrollments.toLocaleString(),
        },
        {
            label: "Active Simulations",
            value: stats.activeSimulations.toLocaleString(),
        },
        {
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
        },
        {
            label: "Skills Assessed",
            value: stats.skillsAssessed.toLocaleString(),
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {stat.label}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {stat.value}
                    </h3>
                </div>
            ))}
        </div>
    )
}
