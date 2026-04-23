export default function Header({ invoices = [], onNewClick = () => {} }) {
  return (
    <div className="flex items-center justify-between mb-16">
      <div>
        <h1 className="font-spartan text-[36px] font-700 text-white mb-2">Invoices</h1>
        <p className="text-[#888EB0] text-sm">{invoices.length} invoices</p>
      </div>
      <button
        onClick={onNewClick}
        className="flex items-center gap-2 bg-[#7C5DFA] hover:bg-[#9277FF] text-white px-6 py-3 rounded-full font-semibold transition-colors"
      >
        <span className="text-xl">+</span>
        <span>New Invoice</span>
      </button>
    </div>
  )
}
