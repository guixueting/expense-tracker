import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface BalanceCardProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function BalanceCard({ totalIncome, totalExpense, balance }: BalanceCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* 总余额 */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-white/10">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-slate-300 text-sm">总余额</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">
          {formatCurrency(balance)}
        </p>
      </Card>

      {/* 本月收入 */}
      <Card className="group hover:shadow-emerald-100 hover:border-emerald-200 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-slate-500 text-sm">本月收入</span>
        </div>
        <p className="text-2xl font-bold text-emerald-600">
          +{formatCurrency(totalIncome)}
        </p>
      </Card>

      {/* 本月支出 */}
      <Card className="group hover:shadow-rose-100 hover:border-rose-200 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <TrendingDown className="w-5 h-5" />
          </div>
          <span className="text-slate-500 text-sm">本月支出</span>
        </div>
        <p className="text-2xl font-bold text-rose-600">
          -{formatCurrency(totalExpense)}
        </p>
      </Card>
    </div>
  )
}

