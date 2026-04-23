import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function InvoiceCard({ invoice, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-theme rounded-lg px-6 py-4 hover:border-primary transition-all flex items-center cursor-pointer group"
    >
      {/* Invoice ID */}
      <div className="w-[15%] text-left">
        <span className="text-label text-[13px]">#</span>
        <span className="text-heading font-bold text-[15px]">{invoice.id}</span>
      </div>

      {/* Due Date */}
      <div className="w-[20%] text-left">
        <span className="text-label text-[13px]">Due </span>
        <span className="text-label text-[13px]">{formatDate(invoice.paymentDue)}</span>
      </div>

      {/* Client Name */}
      <div className="w-[20%] text-left">
        <span className="text-label text-[13px]">{invoice.clientName}</span>
      </div>

      {/* Amount */}
      <div className="w-[20%] text-right">
        <span className="text-heading font-bold text-[15px]">{formatCurrency(invoice.total)}</span>
      </div>

      {/* Status + Arrow */}
      <div className="w-[25%] flex items-center justify-end gap-5">
        <StatusBadge status={invoice.status} />
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="text-primary">
          <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </button>
  )
}
