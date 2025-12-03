'use client'

import { TransactionWithRelations } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import { deleteTransaction } from '@/actions/transactions'
import { useState } from 'react'

interface TransactionItemProps {
  transaction: TransactionWithRelations
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('确定要删除这条记录吗？')) return
    setIsDeleting(true)
    try {
      await deleteTransaction(transaction.id)
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all group">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: transaction.category.color + '20' }}
        >
          {transaction.category.icon || '💰'}
        </div>
        <div>
          <p className="font-medium text-slate-800">{transaction.category.name}</p>
          <p className="text-sm text-slate-400">
            {transaction.account.name}
            {transaction.note && ` · ${transaction.note}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-lg font-semibold ${
            transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {transaction.type === 'INCOME' ? '+' : '-'}
          {formatCurrency(Number(transaction.amount))}
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

