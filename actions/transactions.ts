'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// 临时用户ID，实际应用中应该从session获取
const TEMP_USER_ID = 'temp-user-id'

export async function createTransaction(formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const categoryId = formData.get('categoryId') as string
  const accountId = formData.get('accountId') as string
  const note = formData.get('note') as string
  const dateStr = formData.get('date') as string
  const date = dateStr ? new Date(dateStr) : new Date()

  await prisma.$transaction(async (tx) => {
    // 创建交易记录
    await tx.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        accountId,
        note: note || null,
        date,
        userId: TEMP_USER_ID,
      },
    })

    // 更新账户余额
    const balanceChange = type === 'INCOME' ? amount : -amount
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: balanceChange } },
    })
  })

  revalidatePath('/transactions')
  revalidatePath('/')
}

export async function deleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id, userId: TEMP_USER_ID },
  })

  if (!transaction) throw new Error('Transaction not found')

  await prisma.$transaction(async (tx) => {
    // 恢复账户余额
    const balanceChange = transaction.type === 'INCOME' 
      ? -Number(transaction.amount) 
      : Number(transaction.amount)
    
    await tx.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: balanceChange } },
    })

    // 删除交易
    await tx.transaction.delete({ where: { id } })
  })

  revalidatePath('/transactions')
  revalidatePath('/')
}

export async function updateTransaction(id: string, formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as string
  const categoryId = formData.get('categoryId') as string
  const accountId = formData.get('accountId') as string
  const note = formData.get('note') as string
  const dateStr = formData.get('date') as string
  const date = dateStr ? new Date(dateStr) : new Date()

  const oldTransaction = await prisma.transaction.findUnique({
    where: { id, userId: TEMP_USER_ID },
  })

  if (!oldTransaction) throw new Error('Transaction not found')

  await prisma.$transaction(async (tx) => {
    // 恢复旧账户余额
    const oldBalanceChange = oldTransaction.type === 'INCOME' 
      ? -Number(oldTransaction.amount) 
      : Number(oldTransaction.amount)
    
    await tx.account.update({
      where: { id: oldTransaction.accountId },
      data: { balance: { increment: oldBalanceChange } },
    })

    // 更新交易
    await tx.transaction.update({
      where: { id },
      data: {
        amount,
        type,
        categoryId,
        accountId,
        note: note || null,
        date,
      },
    })

    // 更新新账户余额
    const newBalanceChange = type === 'INCOME' ? amount : -amount
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: newBalanceChange } },
    })
  })

  revalidatePath('/transactions')
  revalidatePath('/')
}

export async function getTransactions(filters?: {
  type?: string
  categoryId?: string
  startDate?: Date
  endDate?: Date
}) {
  return prisma.transaction.findMany({
    where: {
      userId: TEMP_USER_ID,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.startDate && filters?.endDate && {
        date: { gte: filters.startDate, lte: filters.endDate },
      }),
    },
    include: { category: true, account: true },
    orderBy: { date: 'desc' },
    take: 100,
  })
}

export async function getRecentTransactions(limit = 5) {
  return prisma.transaction.findMany({
    where: { userId: TEMP_USER_ID },
    include: { category: true, account: true },
    orderBy: { date: 'desc' },
    take: limit,
  })
}
