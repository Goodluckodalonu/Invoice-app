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
    setInvoices(loadInvoices())
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
      <div className="max-w-[730px] mx-auto py-16 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-heading text-[36px] font-bold tracking-[-1.12px] leading-none mb-2">
              Invoices
            </h1>
            <p className="text-label text-[13px]">
              {totalCount === 0
                ? 'No invoices'
                : `There are ${totalCount} total invoices`}
            </p>
          </div>
          <div className="flex items-center gap-10">
            <Filter selectedStatuses={selectedStatuses} onChange={setSelectedStatuses} />
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-4 bg-primary hover:bg-primary-light text-white pl-2 pr-[15px] py-2 rounded-full font-bold text-[15px] transition-colors"
            >
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M6.313 10.023V6.314H10.023V4.71H6.313V1H4.71V4.71H1V6.314H4.71V10.023H6.313Z" fill="#7C5DFA" />
                </svg>
              </span>
              <span>New Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={() => onViewInvoice?.(invoice.id)}
              />
            ))}
          </div>
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