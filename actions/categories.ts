'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// 临时用户ID
const TEMP_USER_ID = 'temp-user-id'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const color = formData.get('color') as string
  const type = formData.get('type') as string

  await prisma.category.create({
    data: {
      name,
      icon: icon || null,
      color: color || '#6366f1',
      type,
      userId: TEMP_USER_ID,
    },
  })

  revalidatePath('/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const color = formData.get('color') as string

  await prisma.category.update({
    where: { id },
    data: {
      name,
      icon: icon || null,
      color: color || '#6366f1',
    },
  })

  revalidatePath('/categories')
}

export async function deleteCategory(id: string) {
  // Check if category has transactions
  const count = await prisma.transaction.count({
    where: { categoryId: id },
  })

  if (count > 0) {
    throw new Error('无法删除有交易记录的分类')
  }

  await prisma.category.delete({ where: { id } })

  revalidatePath('/categories')
}

export async function getCategories(type?: string) {
  return prisma.category.findMany({
    where: {
      userId: TEMP_USER_ID,
      ...(type && { type }),
    },
    include: {
      _count: { select: { transactions: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
}
