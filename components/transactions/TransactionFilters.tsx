'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string | null
  type: 'INCOME' | 'EXPENSE'
}

interface TransactionFiltersProps {
  categories: Category[]
  onFilterChange: (filters: {
    type?: 'INCOME' | 'EXPENSE'
    categoryId?: string
  }) => void
}

export function TransactionFilters({ categories, onFilterChange }: TransactionFiltersProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | undefined>()
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [isOpen, setIsOpen] = useState(false)

  const hasFilters = type || categoryId

  function handleTypeChange(newType: 'INCOME' | 'EXPENSE' | undefined) {
    setType(newType)
    setCategoryId(undefined)
    onFilterChange({ type: newType, categoryId: undefined })
  }

  function handleCategoryChange(newCategoryId: string | undefined) {
    setCategoryId(newCategoryId)
    onFilterChange({ type, categoryId: newCategoryId })
  }

  function clearFilters() {
    setType(undefined)
    setCategoryId(undefined)
    onFilterChange({})
  }

  const filteredCategories = type 
    ? categories.filter(c => c.type === type)
    : categories

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all',
          hasFilters
            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
        )}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">筛选</span>
        {hasFilters && (
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
            {(type ? 1 : 0) + (categoryId ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-slate-800">筛选条件</span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:text-rose-600"
                >
                  清除全部
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <label className="text-sm text-slate-500 mb-2 block">类型</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTypeChange(type === 'EXPENSE' ? undefined : 'EXPENSE')}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    type === 'EXPENSE'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  支出
                </button>
                <button
                  onClick={() => handleTypeChange(type === 'INCOME' ? undefined : 'INCOME')}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                    type === 'INCOME'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  收入
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm text-slate-500 mb-2 block">分类</label>
              <div className="flex flex-wrap gap-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(categoryId === category.id ? undefined : category.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1',
                      categoryId === category.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    <span>{category.icon || '📁'}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

