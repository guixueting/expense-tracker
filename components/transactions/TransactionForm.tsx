'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createTransaction } from '@/actions/transactions'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  icon: string | null
  color: string
  type: 'INCOME' | 'EXPENSE'
}

interface Account {
  id: string
  name: string
}

interface TransactionFormProps {
  categories: Category[]
  accounts: Account[]
  onSuccess?: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? '保存中...' : '保存记录'}
    </Button>
  )
}

export function TransactionForm({ categories, accounts, onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  const filteredCategories = categories.filter((c) => c.type === type)

  async function handleSubmit(formData: FormData) {
    formData.set('type', type)
    await createTransaction(formData)
    onSuccess?.()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* 类型切换 */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setType('EXPENSE')
            setSelectedCategory('')
          }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
            type === 'EXPENSE'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          支出
        </button>
        <button
          type="button"
          onClick={() => {
            setType('INCOME')
            setSelectedCategory('')
          }}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all',
            type === 'INCOME'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          收入
        </button>
      </div>

      {/* 金额 */}
      <Input
        name="amount"
        type="number"
        step="0.01"
        min="0"
        label="金额"
        placeholder="0.00"
        required
        className="text-2xl font-bold text-center"
      />

      {/* 分类选择 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">分类</label>
        <div className="grid grid-cols-4 gap-2">
          {filteredCategories.map((category) => (
            <label
              key={category.id}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="categoryId"
                value={category.id}
                className="peer sr-only"
                required
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
              />
              <div className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-slate-100 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all hover:bg-slate-50">
                <span className="text-xl">{category.icon || '📁'}</span>
                <span className="text-xs text-slate-600 truncate w-full text-center">
                  {category.name}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 账户选择 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">账户</label>
        <select
          name="accountId"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {/* 日期 */}
      <Input
        name="date"
        type="date"
        label="日期"
        defaultValue={new Date().toISOString().split('T')[0]}
        required
      />

      {/* 备注 */}
      <Input name="note" label="备注" placeholder="添加备注（可选）" />

      <SubmitButton />
    </form>
  )
}

