import { useState, useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import InvoiceCard from '../components/InvoiceCard'
import Filter from '../components/Filter'
import InvoiceForm from '../components/InvoiceForm'
import { loadInvoices, saveInvoices } from '../utils/storage'

export default function InvoiceList({ onViewInvoice }) {
  const [invoices, setInvoices] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState(['draft', 'pending', 'paid'])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
  const data = loadInvoices()
  console.log("Loaded invoices:", data)
  setInvoices(data || [])
}, [])

  const saveAllInvoices = (newInvoices) => {
    setInvoices(newInvoices)
    saveInvoices(newInvoices)
  }

  const filteredInvoices = invoices.filter((inv) => selectedStatuses.includes(inv.status))

  const handleCreateInvoice = (formData) => {
    const existing = invoices.find(inv => inv.id === formData.id)
    if (existing) {
      // Update
      const updated = invoices.map(inv => inv.id === formData.id ? { ...inv, ...formData } : inv)
      saveAllInvoices(updated)
    } else {
      // Create
      saveAllInvoices([...invoices, formData])
    }
  }

  const totalCount = filteredInvoices.length

  return (
    <>
      <div className="max-w-[730px] mx-auto py-8 md:py-12 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h1 className="text-heading text-[24px] md:text-[32px] font-bold tracking-[-0.75px] md:tracking-[-1px] leading-none mb-1 md:mb-2">
              Invoices
            </h1>
            <p className="text-secondary text-[13px]">
              {totalCount === 0
                ? 'No invoices'
                : (
                  <>
                    <span className="hidden md:inline">There are </span>
                    {totalCount}
                    <span className="hidden md:inline"> total</span> invoices
                  </>
                )}
            </p>
          </div>
          <div className="flex items-center gap-10">
            <Filter selectedStatuses={selectedStatuses} onChange={setSelectedStatuses} />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 md:gap-4 bg-primary hover:bg-primary-light text-white pl-1.5 md:pl-2 pr-[12px] md:pr-[15px] py-1.5 md:py-2 rounded-full font-bold text-[15px] transition-colors"
            >
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M6.313 10.023V6.314H10.023V4.71H6.313V1H4.71V4.71H1V6.314H4.71V10.023H6.313Z" fill="#7C5DFA" />
                </svg>
              </span>
              <span>New<span className="hidden md:inline"> Invoice</span></span>
            </button>
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length > 0 ? (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={() => onViewInvoice?.(invoice.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Invoice Form Slide-out */}
      <InvoiceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateInvoice}
      />
    </>
  )
}