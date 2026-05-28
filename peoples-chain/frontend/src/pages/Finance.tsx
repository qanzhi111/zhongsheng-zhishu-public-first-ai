const Finance = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">普惠金融</h1>
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">💰 账户余额</h2>
        <div className="text-3xl font-bold text-gray-900 mb-4">12,580.00 RMBc</div>
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
            充值
          </button>
          <button className="border-2 border-primary text-primary hover:bg-primary/10 py-2 rounded-lg font-medium transition-colors">
            转账
          </button>
          <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium transition-colors">
            提现
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">💵 小额借贷</h2>
          <p className="text-gray-600 mb-4">AI 风控评估，低门槛低利率</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>可借额度</span>
              <span className="font-semibold">50,000 RMBc</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>年利率</span>
              <span className="font-semibold text-green-600">4.5%</span>
            </div>
          </div>
          <button className="w-full bg-success hover:bg-success/90 text-white py-2 rounded-lg font-medium transition-colors">
            申请借款
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">📈 扶贫资金直达</h2>
          <p className="text-gray-600 mb-4">透明可追溯的扶贫资金发放</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>待领取</span>
              <span className="font-semibold">0 RMBc</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>累计领取</span>
              <span className="font-semibold">3,000 RMBc</span>
            </div>
          </div>
          <button className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-lg font-medium transition-colors">
            查看详情
          </button>
        </div>
      </div>
    </div>
  )
}

export default Finance
