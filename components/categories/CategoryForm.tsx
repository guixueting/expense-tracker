'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createCategory } from '@/actions/categories'
import { cn } from '@/lib/utils'

const ICONS = ['🍔', '🚗', '🏠', '💊', '🎮', '👔', '📚', '✈️', '💰', '🎁', '📱', '🛒']
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
]

interface CategoryFormProps {
  onSuccess?: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? '保存中...' : '保存分类'}
    </Button>
  )
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0])
  const [selectedColor, setSelectedColor] = useState(COLORS[0])

  async function handleSubmit(formData: FormData) {
    formData.set('type', type)
    formData.set('icon', selectedIcon)
    formData.set('color', selectedColor)
    await createCategory(formData)
    onSuccess?.()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* 类型切换 */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
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
          onClick={() => setType('INCOME')}
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

      {/* 名称 */}
      <Input
        name="name"
        label="分类名称"
        placeholder="例如：餐饮"
        required
      />

      {/* 图标选择 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">图标</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setSelectedIcon(icon)}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all',
                selectedIcon === icon
                  ? 'bg-emerald-100 ring-2 ring-emerald-500'
                  : 'bg-slate-100 hover:bg-slate-200'
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* 颜色选择 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">颜色</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                'w-8 h-8 rounded-lg transition-all',
                selectedColor === color && 'ring-2 ring-offset-2 ring-slate-400'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}

