import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

async function getStatisticsData() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  // 获取过去6个月的数据
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      label: `${date.getMonth() + 1}月`,
    })
  }

  const [currentMonthStats, categoryStats, monthlyTrends] = await Promise.all([
    // 当月统计
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId: TEMP_USER_ID, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
      _count: true,
    }),
    // 分类统计
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId: TEMP_USER_ID, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    // 月度趋势
    Promise.all(
      months.map(async (month) => {
        const stats = await prisma.transaction.groupBy({
          by: ['type'],
          where: { userId: TEMP_USER_ID, date: { gte: month.start, lte: month.end } },
          _sum: { amount: true },
        })
        return {
          month: month.label,
          income: Number(stats.find((s) => s.type === 'INCOME')?._sum.amount || 0),
          expense: Number(stats.find((s) => s.type === 'EXPENSE')?._sum.amount || 0),
        }
      })
    ),
  ])

  const categories = await prisma.category.findMany({
    where: { userId: TEMP_USER_ID, type: 'EXPENSE' },
  })

  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const totalExpense = Number(
    currentMonthStats.find((s) => s.type === 'EXPENSE')?._sum.amount || 0
  )

  const topCategories = categoryStats
    .map((stat) => {
      const category = categoryMap.get(stat.categoryId)
      const amount = Number(stat._sum.amount || 0)
      return category
        ? {
            name: category.name,
            icon: category.icon,
            color: category.color,
            amount,
            percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
          }
        : null
    })
    .filter(Boolean)
    .sort((a, b) => b!.amount - a!.amount)
    .slice(0, 5) as {
      name: string
      icon: string | null
      color: string
      amount: number
      percentage: number
    }[]

  return {
    totalIncome: Number(currentMonthStats.find((s) => s.type === 'INCOME')?._sum.amount || 0),
    totalExpense,
    incomeCount: currentMonthStats.find((s) => s.type === 'INCOME')?._count || 0,
    expenseCount: currentMonthStats.find((s) => s.type === 'EXPENSE')?._count || 0,
    topCategories,
    monthlyTrends,
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 bg-slate-200 rounded-2xl" />
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  )
}

async function StatisticsContent() {
  const data = await getStatisticsData()
  const maxTrend = Math.max(
    ...data.monthlyTrends.map((t) => Math.max(t.income, t.expense))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">统计报表</h1>
        <p className="text-slate-500 mt-1">查看您的财务统计数据</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">本月收入</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(data.totalIncome)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{data.incomeCount} 笔</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">本月支出</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {formatCurrency(data.totalExpense)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{data.expenseCount} 笔</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">本月结余</p>
            <p className={`text-2xl font-bold mt-1 ${
              data.totalIncome - data.totalExpense >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {formatCurrency(data.totalIncome - data.totalExpense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">储蓄率</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {data.totalIncome > 0
                ? Math.round(((data.totalIncome - data.totalExpense) / data.totalIncome) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 月度趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>收支趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.monthlyTrends.map((trend) => (
                <div key={trend.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{trend.month}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-emerald-600">
                        收入: {formatCurrency(trend.income)}
                      </span>
                      <span className="text-rose-600">
                        支出: {formatCurrency(trend.expense)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div
                      className="bg-emerald-500 rounded-l transition-all"
                      style={{
                        width: `${maxTrend > 0 ? (trend.income / maxTrend) * 50 : 0}%`,
                      }}
                    />
                    <div
                      className="bg-rose-500 rounded-r transition-all"
                      style={{
                        width: `${maxTrend > 0 ? (trend.expense / maxTrend) * 50 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 支出分类 */}
        <Card>
          <CardHeader>
            <CardTitle>支出分布</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topCategories.length === 0 ? (
              <p className="text-center text-slate-400 py-8">暂无支出数据</p>
            ) : (
              <div className="space-y-4">
                {data.topCategories.map((category) => (
                  <div key={category.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{category.icon || '📁'}</span>
                        <span className="text-slate-700">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                          {formatCurrency(category.amount)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StatisticsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StatisticsContent />
    </Suspense>
  )
}

