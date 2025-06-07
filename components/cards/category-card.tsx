interface CategoryCardProps {
  name: string
  icon: string
  jobCount: string
}

export function CategoryCard({ name, icon, jobCount }: CategoryCardProps) {
  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border dark:border-slate-600 hover:shadow-md transition-all duration-300 hover:scale-[1.02] dark:shadow-lg dark:shadow-indigo-900/20">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-medium mb-2 dark:text-white">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-indigo-200">{jobCount}</p>
    </div>
  )
}
