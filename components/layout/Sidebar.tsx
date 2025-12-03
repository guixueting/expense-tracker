'use client'

import Link from 'next/link'
import { NavItem } from './NavItem'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Tags, 
  BarChart3,
  Settings,
  Wallet
} from 'lucide-react'

const navItems = [
  { href: '/', label: '概览', icon: LayoutDashboard },
  { href: '/transactions', label: '交易记录', icon: ArrowLeftRight },
  { href: '/categories', label: '分类管理', icon: Tags },
  { href: '/statistics', label: '统计报表', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            记账本
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">用户</p>
              <p className="text-xs text-slate-400 truncate">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

