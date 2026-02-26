import React from 'react';
import { Shield, MessageCircle, UserMinus } from 'lucide-react';

const instructors = [
    {
        id: '1',
        name: 'Dr. Elena Rodriguez',
        role: 'Senior Engineering Lead',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByTe8o5bmsXo_08mfFzoqGyt6CXcwlu-vE19PpMVCWfTXQHy9OF3Kc44KqnwKLWGzipnnKu8SP5HHPwoGzsh1EpqdunBIscKuJulYnZ90oCrKn2yqMPZP-ob-DBTvyB_a1E0vrpamQIOWoYhgsKEQ0wyu0Lbsm5r8Q_dnoErT-U7PsuAxRaxxrETfhKU3s_9QVcOYg1BZtb3BaalApaO7rV3wLv0fhEfEhjksjCzaIYSQYCqMyQUHLLMVTGbaFdkKjZLEbQct8nrg',
        simulations: ['Cloud Arch', 'Cyber Ops'],
        status: 'Active',
        lastActivity: 'Oct 24, 2023'
    },
    {
        id: '2',
        name: 'Marcus Chen',
        role: 'VP of Product Innovation',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7y21oWu19Jb1_-LyG_SjIpTp9pKF_Df9OGtq4KOINRy7cZTsYnEwO1G80xqL4YxGe7E-SmV8JhnYc_l0uG_5OQSBVq6kZFzoAU0ZKUr5rzYgp-bqBrphzcau6ce-z_HP9OvKSx1D8H101Yb3C_ZpvD0yaqDsyyO327kGrUwKEAnpUaahJf_98TFSzETxevcRH3WViBJs6-ZOsv9FCY6R6DTcCuvLSZhS-H1pTssbZQHMaE9uFcDvIoEmjd4zYPyQnKjmEByEnORk',
        simulations: ['Strategy Sim'],
        status: 'On Leave',
        lastActivity: 'Sep 12, 2023'
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        role: 'L&D Specialist',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJV-MxPP8Dk-6jPlIANOAkK-qOVsHlWssg00KhP8nyUY6gKKvhrysCZMpyAWhEks94tN7OxAhRas5F1HAE3TzJiyOwG4vuQE25bS4oztZaWkpaSlPDJv3kzgNbsfxb2oxtk8VzTXCn3088ciZ_7fBS8mJ4OVJpghRkLsqs1hwkzPztKhzXgOmP9MH-Dq_6lTah0Z3lZyNBNWhvgWMDZ-yphBXr1to_cOVtt2TvlgTR1adJbycbg-Twakk5MhF5z9jnuAyyp3ncpA0',
        simulations: ['Leadership 101', 'Team Dyn'],
        status: 'Active',
        lastActivity: 'Oct 29, 2023'
    },
    {
        id: '4',
        name: 'David Vance',
        role: 'Agile Transformation Coach',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeH-I422w8f-0SjhO4ZdVFCXbCfAKwoUTyOKbisOszGqRFYRk_d1Z_LEGvhlqHY_JIFIj7OY5EQGGgWvMKrqh2JVBoRWvpfYR9HxaumfPD794iGfg-25qCy_A_KF9Veie2AbVOBr1BT7vurB5wt_MPV_tku14qoQnGUfG0p0S-TEpQEgZyGMViJD-JkkQfQhKeoiUVH2AO7ogUp7rn62QszzUizkMfcx1BegxuSYUkwPQnqxJLspBPTnSh4hyZlY6RCh1_zxFAAT4',
        simulations: [],
        status: 'Inactive',
        lastActivity: 'Aug 05, 2023'
    }
];

const InstructorsTable = ({ instructors = [] }: { instructors?: any[] }) => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex justify-between items-center">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Management Directory</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{instructors.length} Total</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Instructor</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assignments</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest uppercase">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Activity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {instructors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No instructors found
                                </td>
                            </tr>
                        ) : (
                            instructors.map((instructor) => (
                                <tr key={instructor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            {instructor.avatar ? (
                                                <div
                                                    className="size-10 rounded-2xl bg-cover bg-center shadow-inner border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform shrink-0"
                                                    style={{ backgroundImage: `url('${instructor.avatar}')` }}
                                                />
                                            ) : (
                                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase shadow-inner border border-primary/20 group-hover:scale-105 transition-transform shrink-0">
                                                    {instructor.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-primary transition-colors truncate">{instructor.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest truncate">{instructor.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {instructor.simulations && instructor.simulations.length > 0 ? (
                                                instructor.simulations.slice(0, 2).map((sim: any, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-[8px] font-black bg-primary/5 text-primary border border-primary/10 uppercase tracking-widest">
                                                        {sim}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Unassigned</span>
                                            )}
                                            {instructor.simulations && instructor.simulations.length > 2 && (
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest self-center">+{instructor.simulations.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${instructor.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : instructor.status === 'On Leave'
                                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            <span className={`size-1 rounded-full ${instructor.status === 'Active' ? 'bg-emerald-500' : instructor.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'
                                                }`}></span>
                                            {instructor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-tight">
                                        {instructor.lastActivity ? new Date(instructor.lastActivity).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm" title="Permissions">
                                                <span className="material-symbols-outlined text-[18px]">security</span>
                                            </button>
                                            <button className="size-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm" title="Message">
                                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Showing {instructors.length} Specialists
                </p>
                <div className="flex gap-2">
                    <button className="h-9 px-4 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm">Previous</button>
                    <button className="h-9 px-4 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm">Next</button>
                </div>
            </div>
        </div>
    );
};

export default InstructorsTable;
