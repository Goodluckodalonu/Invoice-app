import { useState, useEffect, useRef } from 'react'
import StatusBadge from '../components/StatusBadge'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate, calculateDueDate } from '../utils/helpers'
import { loadInvoices, saveInvoices } from '../utils/storage'

export default function InvoiceDetail({ invoiceId, onBack }) {
  const [invoices, setInvoices] = useState(loadInvoices())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const cancelBtnRef = useRef(null)

  useEffect(() => {
    if (showDeleteConfirm) {
      setTimeout(() => {
        cancelBtnRef.current?.focus()
      }, 100)
    }
  }, [showDeleteConfirm])

  const invoice = invoices.find((inv) => inv.id === invoiceId)

  if (!invoice) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-label">Invoice not found</p>
      </div>
    )
  }

  const handleDelete = () => {
    const updated = invoices.filter((inv) => inv.id !== invoiceId)
    setInvoices(updated)
    saveInvoices(updated)
    onBack?.()
  }

  const handleUpdate = (formData) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, ...formData } : inv
    )
    setInvoices(updated)
    saveInvoices(updated)
    setShowEditForm(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) setShowDeleteConfirm(false)
        if (showEditForm) setShowEditForm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showDeleteConfirm, showEditForm])

  const handleMarkAsPaid = () => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
    )
    setInvoices(updated)
    saveInvoices(updated)
  }

  const dueDate = invoice.paymentDue || calculateDueDate(invoice.createdAt, invoice.paymentTerms)

  return (
    <>
      <div className="max-w-[730px] mx-auto py-6 md:py-10 px-6 pb-24 md:pb-10">
        {/* Go Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-6 text-heading font-bold text-[15px] mb-8 hover:text-label transition-colors group"
        >
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
            <path d="M6 9L2 5L6 1" stroke="#7C5DFA" strokeWidth="2" />
          </svg>
          <span>Go back</span>
        </button>

        {/* Status Bar */}
        <div
          className="bg-card rounded-lg p-4 md:p-5 md:px-8 flex items-center justify-between mb-6 border border-theme"
        >
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-5">
            <span className="text-label text-[13px]">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="px-6 py-3 rounded-full font-bold text-[15px] transition-colors"
              style={{
                backgroundColor: 'var(--color-table-header-bg)',
                color: 'var(--color-text-secondary)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#7E88C3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-table-header-bg)';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 rounded-full font-bold text-[15px] text-white bg-danger hover:bg-danger-light transition-colors"
            >
              Delete
            </button>
            {invoice.status !== 'paid' && (
              <button
                onClick={handleMarkAsPaid}
                className="px-6 py-3 rounded-full font-bold text-md md:text-[15px] text-white bg-primary hover:bg-primary-light transition-colors"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        {/* Invoice Body */}
        <div className="bg-card rounded-lg p-6 md:p-12 mb-6 md:mb-8 border border-theme">
          {/* Top: ID, Description, Address */}
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0 mb-8 md:mb-12">
            <div className="flex flex-col">
              <h2 className="text-heading text-[16px] font-bold mb-1 uppercase">
                <span className="text-secondary">#</span>{invoice.id}
              </h2>
              <p className="text-label text-[13px]">{invoice.description}</p>
            </div>

            {/* Sender Address */}
            <div className="text-left md:text-right text-label text-[13px] leading-[18px]">
              <p>{invoice.senderAddress?.street}</p>
              <p>{invoice.senderAddress?.city}</p>
              <p>{invoice.senderAddress?.postCode}</p>
              <p>{invoice.senderAddress?.country}</p>
            </div>
          </div>

          {/* Middle: Grid for Dates and Bill To */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 md:mb-12">
            {/* Dates column */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-label text-[13px] mb-3">Invoice Date</p>
                <p className="text-heading font-bold text-[15px]">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-label text-[13px] mb-3">Payment Due</p>
                <p className="text-heading font-bold text-[15px]">{formatDate(dueDate)}</p>
              </div>
            </div>

            {/* Bill To column */}
            <div className="flex flex-col">
              <p className="text-label text-[13px] mb-3">Bill To</p>
              <p className="text-heading font-bold text-[15px] mb-2">{invoice.clientName}</p>
              <div className="text-label text-[13px] leading-[18px]">
                <p>{invoice.clientAddress?.street}</p>
                <p>{invoice.clientAddress?.city}</p>
                <p>{invoice.clientAddress?.postCode}</p>
                <p>{invoice.clientAddress?.country}</p>
              </div>
            </div>

            {/* Sent to (Desktop: 3rd column, Mobile: below grid) */}
            <div className="hidden md:block">
              <p className="text-label text-[13px] mb-3">Sent to</p>
              <p className="text-heading font-bold text-[15px] break-all">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Mobile Sent To */}
          <div className="md:hidden mb-10">
            <p className="text-label text-[13px] mb-3">Sent to</p>
            <p className="text-heading font-bold text-[15px] break-all">{invoice.clientEmail}</p>
          </div>

          {/* Items Table */}
          <div className="rounded-lg overflow-hidden">
            <div style={{ backgroundColor: 'var(--color-table-header-bg)' }} className="p-6 md:p-8">
              {/* Table Header (Desktop) */}
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 mb-4">
                <span className="text-label text-[13px]">Item Name</span>
                <span className="text-label text-[13px] text-center w-[60px]">QTY.</span>
                <span className="text-label text-[13px] text-right w-[100px]">Price</span>
                <span className="text-label text-[13px] text-right w-[100px]">Total</span>
              </div>

              {/* Table Rows */}
              <div className="space-y-6 md:space-y-4">
                {invoice.items?.map((item, i) => (
                  <div key={i}>
                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                      <span className="text-heading font-bold text-[15px]">{item.name}</span>
                      <span className="text-label font-bold text-[15px] text-center w-[60px]">{item.quantity}</span>
                      <span className="text-label font-bold text-[15px] text-right w-[100px]">{formatCurrency(item.price)}</span>
                      <span className="text-heading font-bold text-[15px] text-right w-[100px]">{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                    {/* Mobile Row */}
                    <div className="md:hidden flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-heading font-bold text-[15px]">{item.name}</span>
                        <span className="text-label font-bold text-[15px]">
                          {item.quantity} x {formatCurrency(item.price)}
                        </span>
                      </div>
                      <span className="text-heading font-bold text-[15px]">{formatCurrency(item.quantity * item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Due */}
            <div
              className="p-6 md:p-8 flex items-center justify-between"
              style={{ backgroundColor: 'var(--color-amount-due-bg)' }}
            >
              <span className="text-white text-[13px]">Amount Due</span>
              <span className="text-white font-bold text-[24px] tracking-[-0.5px]">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Actions Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card px-4 py-5 flex items-center justify-center gap-2 border-t border-theme z-40">
        <button
          onClick={() => setShowEditForm(true)}
          className="px-4 py-2.5 rounded-full font-bold text-[13px] transition-colors flex-1 text-center whitespace-nowrap"
          style={{
            backgroundColor: 'var(--color-table-header-bg)',
            color: 'var(--color-text-secondary)'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2.5 rounded-full font-bold text-[13px] text-white bg-danger hover:bg-danger-light transition-colors flex-1 text-center whitespace-nowrap"
        >
          Delete
        </button>
        {invoice.status !== 'paid' && (
          <button
            onClick={handleMarkAsPaid}
            className="px-4 py-2.5 rounded-full font-bold text-[13px] text-white bg-primary hover:bg-primary-light transition-colors flex-1 text-center whitespace-nowrap"
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center fade-in">
          <div className="bg-card rounded-lg p-12 max-w-[480px] w-full mx-4 border border-theme">
            <h2 className="text-heading text-[24px] font-bold tracking-[-0.5px] mb-3">
              Confirm Deletion
            </h2>
            <p className="text-label text-[13px] leading-[22px] mb-4">
              Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                ref={cancelBtnRef}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 rounded-full font-bold text-[15px] text-label transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--color-input-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-full font-bold text-[15px] text-white bg-danger hover:bg-danger-light transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <InvoiceForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdate}
        editInvoice={invoice}
      />
    </>
  )
}
