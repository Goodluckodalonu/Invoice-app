import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, title, children, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="backdrop:bg-black/50 w-full max-w-2xl bg-[#1E2139] rounded-lg p-8 border border-[#DFE3FA]/10 max-h-[90vh] overflow-auto"
    >
      {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}
      {children}
    </dialog>
  )
}
