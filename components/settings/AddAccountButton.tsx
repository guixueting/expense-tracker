'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { AccountForm } from './AccountForm'

export function AddAccountButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm" className="gap-2">
        <Plus className="w-4 h-4" />
        添加账户
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="添加账户"
      >
        <AccountForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}

