import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TransactionWithRelations } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

interface RecentTransactionsProps {
  transactions: TransactionWithRelations[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>最近交易</CardTitle>
        <Link 
          href="/transactions" 
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          查看全部 →
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-slate-400 py-8">暂无交易记录</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: transaction.category.color + '20' }}
                  >
                    {transaction.category.icon || '💰'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {transaction.category.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(transaction.date)} · {transaction.account.name}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.type === 'INCOME'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(Number(transaction.amount))}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

