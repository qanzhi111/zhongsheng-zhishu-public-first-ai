const Identity = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">DID 身份管理</h1>
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">身份信息</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">DID 地址</span>
            <span className="font-mono text-sm">did:peoples:0x1234...abcd</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">实名认证</span>
            <span className="text-green-600 font-medium">已认证</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">生物识别</span>
            <span className="text-green-600 font-medium">已启用</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">信用评分</span>
            <span className="font-medium">98 / 100</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          更新身份信息
        </button>
        <button className="border-2 border-primary text-primary hover:bg-primary/10 py-3 px-6 rounded-lg font-medium transition-colors">
          查看可验证凭证
        </button>
      </div>
    </div>
  )
}

export default Identity
