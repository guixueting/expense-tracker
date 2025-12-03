import { Prisma } from '@prisma/client'

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: { category: true; account: true }
}>

export type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { transactions: true } } }
}>

export type TransactionType = 'INCOME' | 'EXPENSE'

export type AccountType = 'CASH' | 'BANK_CARD' | 'CREDIT_CARD' | 'ALIPAY' | 'WECHAT' | 'OTHER'

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  balance: number
  monthlyTrend: {
    month: string
    income: number
    expense: number
  }[]
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: string
  accountId?: string
  startDate?: Date
  endDate?: Date
  search?: string
}
