import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import InvoiceList from './pages/InvoiceList'
import InvoiceDetail from './pages/InvoiceDetail'

function AppContent() {
  const [currentView, setCurrentView] = useState('list')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)

  const handleViewInvoice = (id) => {
    setSelectedInvoiceId(id)
    setCurrentView('detail')
  }

  const handleBack = () => {
    setCurrentView('list')
    setSelectedInvoiceId(null)
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-page">
      <Sidebar />
      <main className="flex-1 lg:ml-[103px] pt-[72px] md:pt-[80px] lg:pt-0 overflow-x-hidden min-h-screen">
        {currentView === 'list' ? (
          <InvoiceList onViewInvoice={handleViewInvoice} />
        ) : (
          <InvoiceDetail invoiceId={selectedInvoiceId} onBack={handleBack} />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App