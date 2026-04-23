export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
      {/* Illustration */}
      <div className="w-[242px] h-[200px] mb-16">
        <img
          src="/illustration-empty.svg"
          alt="No invoices"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback inline SVG if image not found
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          className="hidden w-full h-full items-center justify-center"
        >
          <svg viewBox="0 0 242 200" className="w-full h-full" fill="none">
            {/* Envelope body */}
            <rect x="40" y="90" width="162" height="100" rx="6" fill="#1E2139" stroke="#494E6E" strokeWidth="1" />
            <path d="M40 96L121 150L202 96" stroke="#494E6E" strokeWidth="1" fill="none" />

            {/* Person */}
            <circle cx="121" cy="65" r="24" fill="#7C5DFA" opacity="0.9" />
            <rect x="95" y="82" width="52" height="50" rx="4" fill="#7C5DFA" opacity="0.8" />

            {/* Arms */}
            <rect x="68" y="90" width="35" height="8" rx="4" fill="#7C5DFA" opacity="0.6" transform="rotate(-20, 68, 94)" />
            <rect x="140" y="85" width="40" height="8" rx="4" fill="#7C5DFA" opacity="0.6" transform="rotate(15, 140, 89)" />

            {/* Flying documents */}
            <rect x="55" y="40" width="30" height="38" rx="3" fill="white" opacity="0.6" transform="rotate(-15, 70, 59)" />
            <rect x="160" y="35" width="28" height="36" rx="3" fill="white" opacity="0.5" transform="rotate(10, 174, 53)" />
            <rect x="170" y="80" width="20" height="26" rx="3" fill="white" opacity="0.4" transform="rotate(20, 180, 93)" />

            {/* Paper airplane */}
            <polygon points="160,140 180,130 170,145" fill="white" opacity="0.5" />

            {/* Dashed orbit circle */}
            <circle cx="121" cy="90" r="70" stroke="#494E6E" strokeDasharray="6 6" fill="none" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-heading text-[24px] font-bold tracking-[-0.75px] mb-6">
        There is nothing here
      </h2>
      <p className="text-label text-[13px] leading-[18px] text-center max-w-[220px]">
        Create an invoice by clicking the{' '}
        <span className="font-bold">New Invoice</span> button and get started
      </p>
    </div>
  )
}
