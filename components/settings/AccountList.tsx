'use client'

import { Trash2, CreditCard, Wallet, Smartphone } from 'lucide-react'
import { deleteAccount } from '@/actions/accounts'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface Account {
  id: string
  name: string
  type: string
  balance: number | { toNumber: () => number }
  currency: string
}

interface AccountListProps {
  accounts: Account[]
}

const accountIcons: Record<string, React.ReactNode> = {
  CASH: <Wallet className="w-5 h-5" />,
  BANK_CARD: <CreditCard className="w-5 h-5" />,
  CREDIT_CARD: <CreditCard className="w-5 h-5" />,
  ALIPAY: <Smartphone className="w-5 h-5" />,
  WECHAT: <Smartphone className="w-5 h-5" />,
  OTHER: <Wallet className="w-5 h-5" />,
}

const accountTypeNames: Record<string, string> = {
  CASH: '现金',
  BANK_CARD: '银行卡',
  CREDIT_CARD: '信用卡',
  ALIPAY: '支付宝',
  WECHAT: '微信',
  OTHER: '其他',
}

export function AccountList({ accounts }: AccountListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个账户吗？')) return
    setDeletingId(id)
    try {
      await deleteAccount(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : '删除失败')
    } finally {
      setDeletingId(null)
    }
  }

  if (accounts.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8">
        暂无账户，请添加一个账户
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {accounts.map((account) => {
        const balance = typeof account.balance === 'object' 
          ? account.balance.toNumber() 
          : Number(account.balance)
        
        return (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                {accountIcons[account.type] || <Wallet className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-800">{account.name}</p>
                <p className="text-xs text-slate-400">
                  {accountTypeNames[account.type] || account.type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-semibold ${balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                {formatCurrency(balance)}
              </span>
              <button
                onClick={() => handleDelete(account.id)}
                disabled={deletingId === account.id}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

