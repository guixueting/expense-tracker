import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CategoryList } from '@/components/categories/CategoryList'
import { AddCategoryButton } from '@/components/categories/AddCategoryButton'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

async function getCategoriesData() {
  const categories = await prisma.category.findMany({
    where: { userId: TEMP_USER_ID },
    include: {
      _count: { select: { transactions: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE')
  const incomeCategories = categories.filter(c => c.type === 'INCOME')

  return { expenseCategories, incomeCategories }
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

async function CategoriesContent() {
  const data = await getCategoriesData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">分类管理</h1>
          <p className="text-slate-500 mt-1">管理您的收入和支出分类</p>
        </div>
        <AddCategoryButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              支出分类
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryList categories={data.expenseCategories} type="EXPENSE" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              收入分类
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryList categories={data.incomeCategories} type="INCOME" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoriesContent />
    </Suspense>
  )
}

