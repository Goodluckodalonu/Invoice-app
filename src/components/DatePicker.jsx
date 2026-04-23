import { useState, useRef, useEffect } from 'react'
import { formatDate } from '../utils/helpers'

export default function DatePicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [viewDate, setViewDate] = useState(new Date(value))
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
    }

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
        onChange(newDate.toISOString().split('T')[0])
        setIsOpen(false)
    }

    const renderDays = () => {
        const year = viewDate.getFullYear()
        const month = viewDate.getMonth()
        const totalDays = daysInMonth(year, month)
        const firstDay = firstDayOfMonth(year, month)
        const prevMonthTotalDays = daysInMonth(year, month - 1)

        const days = []

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="text-[#494E6E] text-[15px] font-bold py-2 text-center opacity-20">
                    {prevMonthTotalDays - i}
                </div>
            )
        }

        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            const isSelected = new Date(value).toDateString() === new Date(year, month, i).toDateString()
            days.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => handleDateSelect(i)}
                    className={`text-[15px] font-bold py-2 text-center hover:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-heading'}`}
                >
                    {i}
                </button>
            )
        }

        // Next month days
        const remaining = 35 - days.length
        for (let i = 1; i <= remaining; i++) {
            days.push(
                <div key={`next-${i}`} className="text-[#494E6E] text-[15px] font-bold py-2 text-center opacity-20">
                    {i}
                </div>
            )
        }

        return days
    }

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full rounded-[4px] px-5 py-3 text-heading font-bold text-[15px] text-left flex items-center justify-between border input-border bg-input-field focus:border-primary transition-colors"
            >
                <span>{formatDate(value)}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.8 1.6H12V0H10.4V1.6H5.6V0H4V1.6H3.2C2.32 1.6 1.6 2.32 1.6 3.2V14.4C1.6 15.28 2.32 16 3.2 16H12.8C13.68 16 14.4 15.28 14.4 14.4V3.2C14.4 2.32 13.68 1.6 12.8 1.6ZM12.8 14.4H3.2V5.6H12.8V14.4Z" fill="#7E88C3" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-3 z-50 border border-theme">
                    <div className="flex items-center justify-between mb-8">
                        <button type="button" onClick={handlePrevMonth} className="text-primary hover:text-primary transition-colors">
                            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                                <path d="M6 9L2 5L6 1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>
                        <span className="text-heading font-bold text-[15px]">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button type="button" onClick={handleNextMonth} className="text-primary hover:text-primary transition-colors">
                            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                                <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2">
                        {renderDays()}
                    </div>
                </div>
            )}
        </div>
    )
}
