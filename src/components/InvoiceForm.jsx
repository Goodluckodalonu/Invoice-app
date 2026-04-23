import { useState, useEffect, useRef } from 'react'
import { calculateTotal, calculateDueDate, generateInvoiceId } from '../utils/helpers'
import DatePicker from './DatePicker'

const PAYMENT_TERMS_OPTIONS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

const emptyForm = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [],
}

export default function InvoiceForm({ isOpen, onClose, onSubmit, editInvoice = null }) {
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [showTermsDropdown, setShowTermsDropdown] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const panelRef = useRef(null)
  const termsRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      if (editInvoice) {
        setFormData({
          senderAddress: editInvoice.senderAddress || emptyForm.senderAddress,
          clientName: editInvoice.clientName || '',
          clientEmail: editInvoice.clientEmail || '',
          clientAddress: editInvoice.clientAddress || emptyForm.clientAddress,
          createdAt: editInvoice.createdAt || emptyForm.createdAt,
          paymentTerms: editInvoice.paymentTerms || 30,
          description: editInvoice.description || '',
          items: editInvoice.items?.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })) || [],
        })
      } else {
        setFormData(emptyForm)
      }
      setErrors({})
      setIsClosing(false)
    }
  }, [isOpen, editInvoice])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (termsRef.current && !termsRef.current.contains(e.target)) {
        setShowTermsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const validate = () => {
    const e = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.senderAddress.street.trim()) e['sender.street'] = true
    if (!formData.senderAddress.city.trim()) e['sender.city'] = true
    if (!formData.senderAddress.postCode.trim()) e['sender.postCode'] = true
    if (!formData.senderAddress.country.trim()) e['sender.country'] = true
    if (!formData.clientName.trim()) e.clientName = "can't be empty"
    if (!formData.clientEmail.trim()) {
      e.clientEmail = "can't be empty"
    } else if (!emailRegex.test(formData.clientEmail)) {
      e.clientEmail = "invalid email"
    }
    if (!formData.clientAddress.street.trim()) e['client.street'] = true
    if (!formData.clientAddress.city.trim()) e['client.city'] = true
    if (!formData.clientAddress.postCode.trim()) e['client.postCode'] = true
    if (!formData.clientAddress.country.trim()) e['client.country'] = true
    if (!formData.description.trim()) e.description = true
    if (formData.items.length === 0) e.items = true
    formData.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item.${i}.name`] = true
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (status) => {
    if (status === 'draft') {
      // Save as draft without validation
      const total = calculateTotal(formData.items)
      const dueDate = calculateDueDate(formData.createdAt, formData.paymentTerms)
      onSubmit({
        ...formData,
        id: editInvoice?.id || generateInvoiceId(),
        status: 'draft',
        paymentDue: dueDate,
        total,
        items: formData.items.map(item => ({
          ...item,
          total: item.quantity * item.price,
        })),
      })
      handleClose()
      return
    }

    if (!validate()) return

    const total = calculateTotal(formData.items)
    const dueDate = calculateDueDate(formData.createdAt, formData.paymentTerms)
    onSubmit({
      ...formData,
      id: editInvoice?.id || generateInvoiceId(),
      status: status || 'pending',
      paymentDue: dueDate,
      total,
      items: formData.items.map(item => ({
        ...item,
        total: item.quantity * item.price,
      })),
    })
    handleClose()
  }

  const updateSender = (field, value) => {
    setFormData(prev => ({
      ...prev,
      senderAddress: { ...prev.senderAddress, [field]: value },
    }))
  }

  const updateClient = (field, value) => {
    setFormData(prev => ({
      ...prev,
      clientAddress: { ...prev.clientAddress, [field]: value },
    }))
  }

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }],
    }))
  }

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  if (!isOpen && !isClosing) return null

  const inputClass = (errorKey) =>
    `w-full rounded-[4px] px-5 py-2 text-heading font-bold text-[15px] outline-none transition-colors border ${errors[errorKey]
      ? 'border-danger'
      : 'input-border focus:border-primary'
    }`

  const labelClass = 'text-label text-[13px] leading-[15px] mb-[10px] block'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${isClosing ? 'fade-out' : 'fade-in'}`}
        onClick={handleClose}
      />

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        className={`fixed top-[72px] md:top-[80px] lg:top-0 left-0 lg:left-[103px] bottom-0 w-full lg:max-w-[616px] z-50 overflow-y-auto ${isClosing ? 'slide-out' : 'slide-in'
          }`}
        style={{
          backgroundColor: 'var(--color-form-bg)',
          borderRadius: '0 20px 20px 0',
        }}
      >
        <div className="px-6 md:px-12 pt-6 md:pt-10 pb-8">
          {/* Go Back (Mobile) */}
          <button
            onClick={handleClose}
            className="md:hidden flex items-center gap-6 mb-6 text-heading font-bold text-[15px] hover:text-label transition-colors"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M6 1L2 5L6 9" stroke="#7C5DFA" strokeWidth="2" />
            </svg>
            <span>Go back</span>
          </button>

          {/* Title */}
          <h1 className="text-heading text-[20px] md:text-[24px] font-bold tracking-[-0.5px] mb-8 md:mb-12">
            {editInvoice ? (
              <>Edit <span className="text-label">#</span>{editInvoice.id}</>
            ) : (
              'New Invoice'
            )}
          </h1>

          {/* Bill From */}
          <h3 className="text-primary font-bold text-[15px] mb-6">Bill From</h3>

          <div className="mb-6">
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              value={formData.senderAddress.street}
              onChange={(e) => updateSender('street', e.target.value)}
              className={inputClass('sender.street')}
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['sender.street'] ? '#EC5757' : 'var(--color-input-border)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.senderAddress.city}
                onChange={(e) => updateSender('city', e.target.value)}
                className={inputClass('sender.city')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['sender.city'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Post Code</label>
              <input
                type="text"
                value={formData.senderAddress.postCode}
                onChange={(e) => updateSender('postCode', e.target.value)}
                className={inputClass('sender.postCode')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['sender.postCode'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                value={formData.senderAddress.country}
                onChange={(e) => updateSender('country', e.target.value)}
                className={inputClass('sender.country')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['sender.country'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
          </div>

          {/* Bill To */}
          <h3 className="text-primary font-bold text-[15px] mb-6">Bill To</h3>

          <div className="mb-6">
            <div className="flex justify-between">
              <label className={`${labelClass} ${errors.clientName ? 'text-danger' : ''}`}>
                Client's Name
              </label>
              {errors.clientName && (
                <span className="text-danger text-[10px]">{errors.clientName}</span>
              )}
            </div>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className={inputClass('clientName')}
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors.clientName ? '#EC5757' : 'var(--color-input-border)' }}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Client's Email</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              placeholder="e.g. email@example.com"
              className={inputClass('clientEmail')}
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors.clientEmail ? '#EC5757' : 'var(--color-input-border)' }}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              value={formData.clientAddress.street}
              onChange={(e) => updateClient('street', e.target.value)}
              className={inputClass('client.street')}
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['client.street'] ? '#EC5757' : 'var(--color-input-border)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.clientAddress.city}
                onChange={(e) => updateClient('city', e.target.value)}
                className={inputClass('client.city')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['client.city'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Post Code</label>
              <input
                type="text"
                value={formData.clientAddress.postCode}
                onChange={(e) => updateClient('postCode', e.target.value)}
                className={inputClass('client.postCode')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['client.postCode'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                value={formData.clientAddress.country}
                onChange={(e) => updateClient('country', e.target.value)}
                className={inputClass('client.country')}
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors['client.country'] ? '#EC5757' : 'var(--color-input-border)' }}
              />
            </div>
          </div>

          {/* Invoice Date & Payment Terms */}
          <div className="flex flex-col gap-6 mb-8">
            <div>
              <label className={labelClass}>Invoice Date</label>
              <DatePicker
                value={formData.createdAt}
                onChange={(date) => setFormData(prev => ({ ...prev, createdAt: date }))}
              />
            </div>
            <div ref={termsRef} className="relative">
              <label className={labelClass}>Payment Terms</label>
              <button
                type="button"
                onClick={() => setShowTermsDropdown(!showTermsDropdown)}
                className="w-full rounded-[4px] px-5 py-4 text-heading font-bold text-[15px] text-left flex items-center justify-between border"
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)' }}
              >
                <span>{PAYMENT_TERMS_OPTIONS.find(o => o.value === formData.paymentTerms)?.label}</span>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none"
                  className={`transition-transform ${showTermsDropdown ? 'rotate-180' : ''}`}
                >
                  <path d="M1 1L5.228 5.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" />
                </svg>
              </button>
              {showTermsDropdown && (
                <div
                  className="absolute top-full mt-2 left-0 right-0 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] overflow-hidden z-10"
                  style={{ backgroundColor: 'var(--color-dropdown-bg)' }}
                >
                  {PAYMENT_TERMS_OPTIONS.map((option, idx) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, paymentTerms: option.value }))
                        setShowTermsDropdown(false)
                      }}
                      className={`w-full text-left px-6 py-4 text-heading font-bold text-[15px] hover:text-primary transition-colors ${idx < PAYMENT_TERMS_OPTIONS.length - 1 ? 'border-b' : ''
                        }`}
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Description */}
          <div className="mb-8">
            <label className={labelClass}>Project Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Graphic Design Service"
              className={inputClass('description')}
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors.description ? '#EC5757' : 'var(--color-input-border)' }}
            />
          </div>

          {/* Item List */}
          <h3 className="text-[#777F98] font-bold text-[18px] mb-4">Item List</h3>

          {/* Item Headers (Desktop) */}
          {formData.items.length > 0 && (
            <div className="hidden md:grid grid-cols-[1fr_60px_100px_80px_20px] gap-4 mb-4">
              <span className="text-label text-[13px]">Item Name</span>
              <span className="text-label text-[13px]">Qty.</span>
              <span className="text-label text-[13px]">Price</span>
              <span className="text-label text-[13px]">Total</span>
              <span />
            </div>
          )}

          {/* Items */}
          <div className="space-y-12 md:space-y-4 mb-12 md:mb-4">
            {formData.items.map((item, i) => (
              <div key={i} className="flex flex-col md:grid md:grid-cols-[1fr_60px_100px_80px_20px] gap-4 md:items-center">
                <div className="flex flex-col gap-2 md:contents">
                  <span className="md:hidden text-label text-[13px]">Item Name</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    className={inputClass(`item.${i}.name`)}
                    style={{ backgroundColor: 'var(--color-input-bg)', borderColor: errors[`item.${i}.name`] ? '#EC5757' : 'var(--color-input-border)' }}
                  />
                </div>

                <div className="grid grid-cols-[64px_100px_1fr_20px] md:contents gap-4 items-center">
                  <div className="flex flex-col gap-2">
                    <span className="md:hidden text-label text-[13px]">Qty.</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 0)}
                      className={`${inputClass('')} text-center px-0`}
                      style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="md:hidden text-label text-[13px]">Price</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value) || 0)}
                      className={inputClass('')}
                      style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="md:hidden text-label text-[13px]">Total</span>
                    <span className="text-label font-bold text-[15px] h-[48px] flex items-center">
                      {(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="md:hidden text-label text-[13px]">&nbsp;</span>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-label hover:text-danger transition-colors h-[48px] flex items-center justify-center"
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
                        <path d="M8.44 0l.958.958H12.5v1.916H.5V.958h3.102L4.56 0h3.88zM1.458 14.583c0 1.055.862 1.917 1.917 1.917h6.25c1.055 0 1.917-.862 1.917-1.917V3.833H1.458v10.75z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="w-full py-2.5 rounded-full font-bold text-[15px] text-label transition-colors hover:opacity-80 mb-6"
            style={{ backgroundColor: 'var(--color-input-border)' }}
          >
            + Add New Item
          </button>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-8 space-y-1">
              <p className="text-danger text-[10px]">- All fields must be added</p>
              {errors.items && <p className="text-danger text-[10px]">- An item must be added</p>}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div
          className="sticky bottom-0 px-6 md:px-12 py-6 flex items-center gap-2"
          style={{
            backgroundColor: 'var(--color-form-bg)',
            boxShadow: '0 -10px 20px rgba(0,0,0,0.1)',
          }}
        >
          {editInvoice ? (
            <>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 rounded-full font-bold text-[13px] text-label transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--color-input-border)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('pending')}
                className="px-6 py-2 rounded-full font-bold text-[13px] text-white bg-primary hover:bg-primary-light transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 md:px-6 py-2 rounded-full font-bold text-[13px] text-[#7E88C3] bg-white hover:bg-[#DFE3FA] transition-colors"
              >
                Discard
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="px-4 md:px-6 py-2 rounded-full font-bold text-[13px] text-[#888EB0] bg-[#373B53] hover:bg-[#0C0E16] transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('pending')}
                className="px-4 md:px-6 py-2 rounded-full font-bold text-[13px] text-white bg-primary hover:bg-primary-light transition-colors"
              >
                Save & Send
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
