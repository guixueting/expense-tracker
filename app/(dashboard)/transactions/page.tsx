import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { TransactionList } from '@/components/transactions/TransactionList'
import { AddTransactionButton } from '@/components/transactions/AddTransactionButton'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

async function getTransactionsData() {
  const [transactions, categories, accounts] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: TEMP_USER_ID },
      include: { category: true, account: true },
      orderBy: { date: 'desc' },
      take: 100,
    }),
    prisma.category.findMany({
      where: { userId: TEMP_USER_ID },
    }),
    prisma.account.findMany({
      where: { userId: TEMP_USER_ID },
    }),
  ])

  return { transactions, categories, accounts }
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-20 bg-slate-200 rounded-xl" />
      ))}
    </div>
  )
}

async function TransactionsContent() {
  const data = await getTransactionsData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">交易记录</h1>
          <p className="text-slate-500 mt-1">
            共 {data.transactions.length} 条记录
          </p>
        </div>
        <AddTransactionButton 
          categories={data.categories.filter(
            (cat) => cat.type === 'EXPENSE' || cat.type === 'INCOME'
          ).map(cat => ({
            ...cat,
            type: cat.type === 'EXPENSE' ? 'EXPENSE' : 'INCOME'
          }))} 
          accounts={data.accounts} 
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
        <TransactionList transactions={data.transactions} />
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TransactionsContent />
    </Suspense>
  )
}

