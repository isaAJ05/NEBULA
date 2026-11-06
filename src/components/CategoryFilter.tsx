export interface Category {
  label: string
  query: string
  emoji: string
}

interface CategoryFilterProps {
  categories: Category[]
  active: string
  onSelect: (query: string) => void
}

export default function CategoryFilter({ categories, active, onSelect }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filter by object type" className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat.query === active
        return (
          <button
            key={cat.query}
            type="button"
            onClick={() => onSelect(cat.query)}
            aria-pressed={isActive}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-linear-to-r from-nebula-500 to-plasma-500 text-white shadow-[0_0_24px_-4px_rgb(232_121_249/0.85)]'
                : 'bg-cosmos-800/70 text-nebula-300 ring-1 ring-nebula-400/20 hover:bg-cosmos-700 hover:text-white hover:ring-nebula-400/50'
            }`}
          >
            <span aria-hidden="true">{cat.emoji}</span>
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
