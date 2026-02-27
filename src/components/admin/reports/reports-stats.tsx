import { TrendingUp, TrendingDown, Building2, Users, Ticket, BrainCircuit } from "lucide-react"

export function ReportsStats({ stats }: { stats: any }) {
    const statCards = [
        { label: "Total Partners", value: stats.totalPartners.value, trend: stats.totalPartners.trend, isUp: stats.totalPartners.isUp, icon: Building2 },
        { label: "Active Users", value: stats.activeUsers.value, trend: stats.activeUsers.trend, isUp: stats.activeUsers.isUp, icon: Users },
        { label: "Redemptions", value: stats.redemptions.value, trend: stats.redemptions.trend, isUp: stats.redemptions.isUp, icon: Ticket },
        { label: "Avg. Simulations", value: stats.avgSims.value, trend: stats.avgSims.trend, isUp: stats.avgSims.isUp, icon: BrainCircuit },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1f1629] p-6 rounded-xl border border-slate-200 dark:border-[#382a4a] flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-[#734c9a] dark:text-[#a682cc] text-sm font-medium">{card.label}</p>
                        <card.icon className="text-primary size-5" />
                    </div>
                    <p className="text-3xl font-bold text-[#140d1b] dark:text-white">{card.value}</p>
                    <p className={`${card.isUp ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'} text-xs font-bold flex items-center gap-1`}>
                        {card.isUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                        {card.trend} vs last month
                    </p>
                </div>
            ))}
        </div>
    )
}
