'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

export async function createAccount(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const balance = parseFloat(formData.get('balance') as string) || 0

  await prisma.account.create({
    data: {
      name,
      type: type || 'CASH',
      balance,
      userId: TEMP_USER_ID,
    },
  })

  revalidatePath('/settings')
}

export async function updateAccount(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string

  await prisma.account.update({
    where: { id },
    data: {
      name,
      type,
    },
  })

  revalidatePath('/settings')
}

export async function deleteAccount(id: string) {
  // Check if account has transactions
  const count = await prisma.transaction.count({
    where: { accountId: id },
  })

  if (count > 0) {
    throw new Error('无法删除有交易记录的账户')
  }

  await prisma.account.delete({ where: { id } })

  revalidatePath('/settings')
}

export async function getAccounts() {
  return prisma.account.findMany({
    where: { userId: TEMP_USER_ID },
    orderBy: { createdAt: 'asc' },
  })
}
