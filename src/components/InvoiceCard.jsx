import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function InvoiceCard({ invoice, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-theme rounded-lg px-6 py-4 hover:border-primary transition-all cursor-pointer group"
    >
      {/* ── Desktop Row ── */}
      <div className="hidden md:flex items-center w-full">
        <div className="w-[15%] text-left">
          <span className="text-secondary text-[13px]">#</span>
          <span className="text-heading font-bold text-[15px]">{invoice.id}</span>
        </div>
        <div className="w-[20%] text-left">
          <span className="text-secondary text-[13px]">Due </span>
          <span className="text-heading text-[13px]">{formatDate(invoice.paymentDue)}</span>
        </div>
        <div className="w-[20%] text-left truncate">
          <span className="text-heading text-[13px]">{invoice.clientName}</span>
        </div>
        <div className="w-[20%] text-right">
          <span className="text-heading font-bold text-[15px]">{formatCurrency(invoice.total)}</span>
        </div>
        <div className="w-[25%] flex items-center justify-end gap-5">
          <StatusBadge status={invoice.status} />
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="text-primary">
            <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="md:hidden flex flex-col gap-6">
        {/* Row 1: ID (left) + Client Name (right) */}
        <div className="flex justify-between items-center">
          <div className="text-left">
            <span className="text-secondary text-[13px]">#</span>
            <span className="text-heading font-bold text-[15px]">{invoice.id}</span>
          </div>
          <div className="text-right">
            <span className="text-heading text-[13px]">{invoice.clientName}</span>
          </div>
        </div>

        {/* Row 2: Due + Amount (left) + Status (right) */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col text-left gap-1">
            <span className="text-secondary text-[13px]">Due {formatDate(invoice.paymentDue)}</span>
            <span className="text-heading font-bold text-[15px]">{formatCurrency(invoice.total)}</span>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </button>
  )
}
