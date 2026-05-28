import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/dashboard', label: '仪表盘', icon: '📊' },
    { path: '/identity', label: '身份管理', icon: '🆔' },
    { path: '/payment', label: '政务缴费', icon: '💳' },
    { path: '/medical', label: '医疗服务', icon: '🏥' },
    { path: '/finance', label: '普惠金融', icon: '💰' },
    { path: '/governance', label: 'DAO治理', icon: '🏛️' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🔗</span>
              <h1 className="text-xl font-bold">人民链</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-secondary hover:bg-secondary/90 px-4 py-2 rounded-lg transition-colors">
                登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm opacity-75">
              人民链 - 让区块链服务人民 | 基于长安链 + 众生智枢 AI 引擎
            </p>
            <p className="text-xs opacity-50 mt-2">
              © 2026 人民链开源社区. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
