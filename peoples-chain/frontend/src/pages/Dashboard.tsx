const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">仪表盘</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-gray-900">12,580 RMBc</div>
          <div className="text-sm text-gray-500">稳定币余额</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl mb-2">🎖️</div>
          <div className="text-2xl font-bold text-gray-900">350 GXC</div>
          <div className="text-sm text-gray-500">贡献币</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl mb-2">🗳️</div>
          <div className="text-2xl font-bold text-gray-900">1 GOV</div>
          <div className="text-sm text-gray-500">治理权</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">98%</div>
          <div className="text-sm text-gray-500">信用评分</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">AI 链上大脑状态</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">风控引擎</span>
              <span className="text-green-600 font-medium">运行中</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">审计引擎</span>
              <span className="text-green-600 font-medium">运行中</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">治理引擎</span>
              <span className="text-green-600 font-medium">运行中</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">最近交易</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">社保缴费</div>
                <div className="text-sm text-gray-500">2026-05-28</div>
              </div>
              <div className="text-red-600 font-medium">-580 RMBc</div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">转账收款</div>
                <div className="text-sm text-gray-500">2026-05-27</div>
              </div>
              <div className="text-green-600 font-medium">+2000 RMBc</div>
            </div>
            <div className="flex justify-between py-2">
              <div>
                <div className="font-medium">贡献奖励</div>
                <div className="text-sm text-gray-500">2026-05-26</div>
              </div>
              <div className="text-green-600 font-medium">+10 GXC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
