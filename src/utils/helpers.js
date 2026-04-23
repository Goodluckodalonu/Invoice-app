export const statusLabel = {
  draft: 'Draft',
  pending: 'Pending',
  paid: 'Paid',
}

export function formatCurrency(value) {
  return `£ ${Number(value).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function generateInvoiceId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const l1 = letters[Math.floor(Math.random() * 26)]
  const l2 = letters[Math.floor(Math.random() * 26)]
  const num = Math.floor(Math.random() * 9000 + 1000)
  return `${l1}${l2}${num}`
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const price = Number(item.price) || 0
    return sum + quantity * price
  }, 0)
}

export function calculateDueDate(invoiceDate, paymentTerms) {
  const date = new Date(invoiceDate)
  date.setDate(date.getDate() + paymentTerms)
  return date.toISOString().split('T')[0]
}
