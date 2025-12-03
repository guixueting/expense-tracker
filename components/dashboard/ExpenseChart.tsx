'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

interface CategoryStat {
  name: string
  icon: string | null
  color: string
  amount: number
  percentage: number
}

interface ExpenseChartProps {
  categories: CategoryStat[]
  total: number
}

export function ExpenseChart({ categories, total }: ExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>支出分布</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-center text-slate-400 py-8">暂无支出数据</p>
        ) : (
          <div className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-3">
              {categories.slice(0, 5).map((category) => (
                <div key={category.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{category.icon || '📁'}</span>
                      <span className="text-slate-700">{category.name}</span>
                    </div>
                    <span className="text-slate-500">
                      {formatCurrency(category.amount)}
                    </span>
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

            {/* Total */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">总支出</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

