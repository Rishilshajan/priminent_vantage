"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { State, IState } from "country-state-city"

interface StateSelectProps {
    countryCode: string
    value?: string // isoCode of the state
    onChange: (value: string) => void
    error?: boolean
}

export function StateSelect({ countryCode, value, onChange, error }: StateSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    const states = React.useMemo(() => {
        if (!countryCode) return []
        return State.getStatesOfCountry(countryCode)
    }, [countryCode])

    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(search.toLowerCase())
    )

    const selectedState = states.find(s => s.isoCode === value)

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                onClick={() => {
                    if (states.length > 0) setIsOpen(!isOpen)
                }}
                className={cn(
                    "flex w-full appearance-none rounded-2xl border border-slate-200/60 bg-white px-5 py-4 text-[15px] font-bold text-slate-700 shadow-sm outline-none transition-all focus:border-[#a344ff] focus:ring-4 focus:ring-[#7f13ec]/10 dark:border-slate-800/60 dark:bg-[#1e1429] dark:text-white cursor-pointer h-auto items-center justify-between",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                    isOpen && "border-[#a344ff] ring-4 ring-[#7f13ec]/10",
                    states.length === 0 && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900"
                )}
            >
                {selectedState ? (
                    <span className="truncate">{selectedState.name}</span>
                ) : (
                    <span className="text-slate-400 font-medium">Select State / Province</span>
                )}
                <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
            </div>

            {isOpen && states.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200/60 bg-white shadow-xl focus:outline-none dark:border-slate-800/60 dark:bg-[#1e1429]">
                    <div className="sticky top-0 bg-white px-3 py-2 border-b border-slate-100 z-10 dark:bg-[#1e1429] dark:border-slate-800">
                        <input
                            type="text"
                            placeholder="Search state..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#a344ff] focus:outline-none dark:border-slate-700 dark:bg-[#150d1d] dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {filteredStates.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No state found</div>
                    ) : (
                        <ul className="py-1">
                            {filteredStates.map((state: IState) => (
                                <li
                                    key={state.isoCode}
                                    onClick={() => {
                                        onChange(state.isoCode)
                                        setIsOpen(false)
                                        setSearch("")
                                    }}
                                    className={cn(
                                        "flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#7f13ec] dark:hover:bg-slate-800/50 dark:hover:text-white transition-colors",
                                        value === state.isoCode && "bg-[#7f13ec]/5 text-[#7f13ec] font-bold dark:bg-slate-800 dark:text-white"
                                    )}
                                >
                                    <span className="text-[14px] truncate">{state.name}</span>
                                    {value === state.isoCode && <Check className="h-4 w-4 shrink-0 text-[#7f13ec]" />}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
