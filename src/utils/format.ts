export function formatYear(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? '—' : d.getFullYear().toString()
}

export function formatDate(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return 'Unknown date'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
