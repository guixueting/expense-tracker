'use client'

import { TransactionWithRelations } from '@/types'
import { TransactionItem } from './TransactionItem'
import { formatDate } from '@/lib/utils'

interface TransactionListProps {
  transactions: TransactionWithRelations[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">暂无交易记录</p>
        <p className="text-sm text-slate-300 mt-1">点击右上角按钮添加第一笔记录</p>
      </div>
    )
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, TransactionWithRelations[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-slate-500 mb-3">{date}</h3>
          <div className="space-y-2">
            {items.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

