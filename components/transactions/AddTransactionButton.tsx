'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TransactionForm } from './TransactionForm'

interface Category {
  id: string
  name: string
  icon: string | null
  color: string
  type: string
}

interface Account {
  id: string
  name: string
}

interface AddTransactionButtonProps {
  categories: Category[]
  accounts: Account[]
}

export function AddTransactionButton({ categories, accounts }: AddTransactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        记一笔
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="添加交易"
      >
        <TransactionForm
          categories={categories.filter(
            (cat) => cat.type === 'EXPENSE' || cat.type === 'INCOME'
          ).map(cat => ({
            ...cat,
            type: cat.type === 'EXPENSE' ? 'EXPENSE' : 'INCOME'
          }))}
          accounts={accounts}
          onSuccess={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

