'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createAccount } from '@/actions/accounts'

const ACCOUNT_TYPES = [
  { value: 'CASH', label: '现金' },
  { value: 'BANK_CARD', label: '银行卡' },
  { value: 'CREDIT_CARD', label: '信用卡' },
  { value: 'ALIPAY', label: '支付宝' },
  { value: 'WECHAT', label: '微信' },
  { value: 'OTHER', label: '其他' },
]

interface AccountFormProps {
  onSuccess?: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? '保存中...' : '保存账户'}
    </Button>
  )
}

export function AccountForm({ onSuccess }: AccountFormProps) {
  async function handleSubmit(formData: FormData) {
    await createAccount(formData)
    onSuccess?.()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* 名称 */}
      <Input
        name="name"
        label="账户名称"
        placeholder="例如：工商银行储蓄卡"
        required
      />

      {/* 类型 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">账户类型</label>
        <select
          name="type"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {ACCOUNT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* 初始余额 */}
      <Input
        name="balance"
        type="number"
        step="0.01"
        label="初始余额"
        placeholder="0.00"
        defaultValue="0"
      />

      <SubmitButton />
    </form>
  )
}

