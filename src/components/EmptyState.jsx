import emptyImage from '../assets/emptystate.svg'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
      {/* Illustration */}
      <div className="w-[242px] h-[200px] mb-16">
        <img
          src={emptyImage}
          alt="No invoices"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <h2 className="text-heading text-[24px] font-bold tracking-[-0.75px] mb-6">
        There is nothing here
      </h2>
      <p className="text-label text-[13px] leading-[18px] text-center max-w-[220px]">
        Create an invoice by clicking the{' '}
        <span className="font-bold"> New Invoice</span> button and get started
      </p>
    </div>
  )
}
