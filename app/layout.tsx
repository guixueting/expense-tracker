import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '记账本 - 轻松管理您的财务',
  description: '一个简单易用的个人记账应用，帮助您追踪收入和支出',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}

