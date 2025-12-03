import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TEMP_USER_ID = 'temp-user-id'

async function main() {
  // 创建临时用户
  const user = await prisma.user.upsert({
    where: { id: TEMP_USER_ID },
    update: {},
    create: {
      id: TEMP_USER_ID,
      email: 'demo@example.com',
      name: '演示用户',
      password: 'demo123',
    },
  })

  console.log('Created user:', user.name)

  // 创建默认账户 - 顺序执行
  await prisma.account.upsert({
    where: { id: 'account-cash' },
    update: {},
    create: {
      id: 'account-cash',
      name: '现金',
      type: 'CASH',
      balance: 1000,
      userId: TEMP_USER_ID,
    },
  })

  await prisma.account.upsert({
    where: { id: 'account-bank' },
    update: {},
    create: {
      id: 'account-bank',
      name: '银行卡',
      type: 'BANK_CARD',
      balance: 5000,
      userId: TEMP_USER_ID,
    },
  })

  await prisma.account.upsert({
    where: { id: 'account-alipay' },
    update: {},
    create: {
      id: 'account-alipay',
      name: '支付宝',
      type: 'ALIPAY',
      balance: 2000,
      userId: TEMP_USER_ID,
    },
  })

  console.log('Created accounts: 3')

  // 创建支出分类
  const expenseCategories = [
    { id: 'cat-food', name: '餐饮', icon: '🍔', color: '#ef4444' },
    { id: 'cat-transport', name: '交通', icon: '🚗', color: '#f97316' },
    { id: 'cat-shopping', name: '购物', icon: '🛒', color: '#eab308' },
    { id: 'cat-entertainment', name: '娱乐', icon: '🎮', color: '#22c55e' },
    { id: 'cat-housing', name: '住房', icon: '🏠', color: '#3b82f6' },
    { id: 'cat-medical', name: '医疗', icon: '💊', color: '#8b5cf6' },
    { id: 'cat-education', name: '教育', icon: '📚', color: '#ec4899' },
    { id: 'cat-other-expense', name: '其他', icon: '📁', color: '#6b7280' },
  ]

  // 创建收入分类
  const incomeCategories = [
    { id: 'cat-salary', name: '工资', icon: '💰', color: '#10b981' },
    { id: 'cat-bonus', name: '奖金', icon: '🎁', color: '#06b6d4' },
    { id: 'cat-investment', name: '投资', icon: '📈', color: '#6366f1' },
    { id: 'cat-other-income', name: '其他', icon: '💵', color: '#84cc16' },
  ]

  for (const cat of expenseCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        ...cat,
        type: 'EXPENSE',
        userId: TEMP_USER_ID,
      },
    })
  }

  for (const cat of incomeCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        ...cat,
        type: 'INCOME',
        userId: TEMP_USER_ID,
      },
    })
  }

  console.log('Created categories:', expenseCategories.length + incomeCategories.length)

  // 删除旧的示例交易
  await prisma.transaction.deleteMany({
    where: { userId: TEMP_USER_ID },
  })

  // 创建一些示例交易
  const now = new Date()
  const transactions = [
    {
      amount: 35,
      type: 'EXPENSE',
      categoryId: 'cat-food',
      accountId: 'account-alipay',
      note: '午餐',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      amount: 15,
      type: 'EXPENSE',
      categoryId: 'cat-transport',
      accountId: 'account-alipay',
      note: '地铁',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      amount: 200,
      type: 'EXPENSE',
      categoryId: 'cat-shopping',
      accountId: 'account-bank',
      note: '日用品',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      amount: 50,
      type: 'EXPENSE',
      categoryId: 'cat-entertainment',
      accountId: 'account-cash',
      note: '电影',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      amount: 15000,
      type: 'INCOME',
      categoryId: 'cat-salary',
      accountId: 'account-bank',
      note: '月薪',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: {
        ...tx,
        userId: TEMP_USER_ID,
      },
    })
  }

  console.log('Created transactions:', transactions.length)

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
