import { useState, useRef, useEffect } from 'react'

export default function Filter({ selectedStatuses = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const statuses = ['draft', 'pending', 'paid']

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleStatus = (status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    onChange(updated)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-heading font-bold text-[15px] hover:opacity-80 transition-opacity"
      >
        <span>Filter<span className="hidden md:inline"> by status</span></span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5.228 5.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-6 left-1/2 -translate-x-1/2 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-6 w-[192px] space-y-4 z-50"
          style={{ backgroundColor: 'var(--color-dropdown-bg)' }}
        >
          {statuses.map((status) => (
            <label
              key={status}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors
                  ${selectedStatuses.includes(status)
                    ? 'bg-primary border-primary'
                    : 'border-transparent hover:border-primary'
                  }`}
                style={{
                  backgroundColor: selectedStatuses.includes(status)
                    ? '#7C5DFA'
                    : 'var(--color-input-border)',
                }}
                onClick={(e) => {
                  e.preventDefault()
                  toggleStatus(status)
                }}
              >
                {selectedStatuses.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1.5 4.5L3.5 6.5L8.5 1.5"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
              <span className="text-heading font-bold text-[13px] capitalize">
                {status}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
