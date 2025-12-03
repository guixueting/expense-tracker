'use client'

import { Trash2, Edit2 } from 'lucide-react'
import { deleteCategory } from '@/actions/categories'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  icon: string | null
  color: string
  type: string
  _count: { transactions: number }
}

interface CategoryListProps {
  categories: Category[]
  type: 'INCOME' | 'EXPENSE'
}

export function CategoryList({ categories, type }: CategoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个分类吗？')) return
    setDeletingId(id)
    try {
      await deleteCategory(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    } finally {
      setDeletingId(null)
    }
  }

  if (categories.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        暂无{type === 'EXPENSE' ? '支出' : '收入'}分类
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: category.color + '20' }}
            >
              {category.icon || '📁'}
            </div>
            <div>
              <p className="font-medium text-slate-800">{category.name}</p>
              <p className="text-xs text-slate-400">
                {category._count.transactions} 笔交易
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDelete(category.id)}
              disabled={deletingId === category.id || category._count.transactions > 0}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={category._count.transactions > 0 ? '有交易记录的分类无法删除' : '删除'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

