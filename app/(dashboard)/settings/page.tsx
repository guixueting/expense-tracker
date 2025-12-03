import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { AccountList } from '@/components/settings/AccountList'
import { AddAccountButton } from '@/components/settings/AddAccountButton'
import { formatCurrency } from '@/lib/utils'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

async function getSettingsData() {
  const accounts = await prisma.account.findMany({
    where: { userId: TEMP_USER_ID },
    orderBy: { createdAt: 'asc' },
  })

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  return { accounts, totalBalance }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-slate-200 rounded-2xl" />
      <div className="h-80 bg-slate-200 rounded-2xl" />
    </div>
  )
}

async function SettingsContent() {
  const data = await getSettingsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">设置</h1>
        <p className="text-slate-500 mt-1">管理您的账户和偏好设置</p>
      </div>

      {/* 总资产 */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="pt-6">
          <p className="text-slate-300 text-sm">总资产</p>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(data.totalBalance)}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            共 {data.accounts.length} 个账户
          </p>
        </CardContent>
      </Card>

      {/* 账户管理 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>账户管理</CardTitle>
          <AddAccountButton />
        </CardHeader>
        <CardContent>
          <AccountList accounts={data.accounts} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SettingsContent />
    </Suspense>
  )
}

