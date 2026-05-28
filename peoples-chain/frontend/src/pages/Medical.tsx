const Medical = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">医疗服务</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">🏥 电子病历</h2>
          <p className="text-gray-600 mb-4">安全、可追溯的电子病历存储与共享</p>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
            查看病历
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">💊 医保结算</h2>
          <p className="text-gray-600 mb-4">智能、透明的医保费用结算服务</p>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
            医保结算
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">🔬 药品溯源</h2>
          <p className="text-gray-600 mb-4">全流程药品溯源，保障用药安全</p>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
            药品查询
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">📋 预约挂号</h2>
          <p className="text-gray-600 mb-4">便捷的在线预约挂号服务</p>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
            立即预约
          </button>
        </div>
      </div>
    </div>
  )
}

export default Medical
