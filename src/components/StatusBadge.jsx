export default function StatusBadge({ status = 'pending' }) {
  const config = {
    paid: {
      bg: 'rgba(51, 214, 159, 0.06)',
      text: '#33D69F',
      dot: '#33D69F',
      label: 'Paid',
    },
    pending: {
      bg: 'rgba(255, 143, 0, 0.06)',
      text: '#FF8F00',
      dot: '#FF8F00',
      label: 'Pending',
    },
    draft: {
      bg: 'var(--color-draft-bg)',
      text: 'var(--color-draft-text)',
      dot: 'var(--color-draft-text)',
      label: 'Draft',
    },
  }

  const s = config[status] || config.pending

  return (
    <div
      className="inline-flex items-center justify-center gap-2 px-[18px] py-[12px] rounded-[6px] min-w-[104px] font-semibold text-[13px] leading-[15px]"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: s.dot }}
      />
      {s.label}
    </div>
  )
}
