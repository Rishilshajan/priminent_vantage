export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full flex-col">
            {/* Sidebar or Header will go here later */}
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}
