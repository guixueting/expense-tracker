import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { getMonthRange } from '@/lib/utils'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { AddTransactionButton } from '@/components/transactions/AddTransactionButton'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

async function getDashboardData() {
  const { start, end } = getMonthRange()

  const [transactions, monthlyStats, categories, accounts, expenseByCategory] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: TEMP_USER_ID },
      include: { category: true, account: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId: TEMP_USER_ID, date: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.category.findMany({
      where: { userId: TEMP_USER_ID },
    }),
    prisma.account.findMany({
      where: { userId: TEMP_USER_ID },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { 
        userId: TEMP_USER_ID, 
        type: 'EXPENSE',
        date: { gte: start, lte: end } 
      },
      _sum: { amount: true },
    }),
  ])

  const totalIncome = Number(
    monthlyStats.find((s) => s.type === 'INCOME')?._sum.amount || 0
  )
  const totalExpense = Number(
    monthlyStats.find((s) => s.type === 'EXPENSE')?._sum.amount || 0
  )

  // 获取分类详情
  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const expenseCategories = expenseByCategory
    .map(e => {
      const category = categoryMap.get(e.categoryId)
      const amount = Number(e._sum.amount || 0)
      return category ? {
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      } : null
    })
    .filter(Boolean)
    .sort((a, b) => b!.amount - a!.amount) as {
      name: string
      icon: string | null
      color: string
      amount: number
      percentage: number
    }[]

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categories,
    accounts,
    expenseCategories,
  }
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 bg-slate-200 rounded-2xl" />
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  )
}

async function DashboardContent() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            你好 👋
          </h1>
          <p className="text-slate-500 mt-1">这是你的财务概览</p>
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

      <BalanceCard
        totalIncome={data.totalIncome}
        totalExpense={data.totalExpense}
        balance={data.balance}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={data.transactions} />
        <ExpenseChart 
          categories={data.expenseCategories} 
          total={data.totalExpense} 
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

