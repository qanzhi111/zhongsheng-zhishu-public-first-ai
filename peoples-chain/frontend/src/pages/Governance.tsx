const Governance = () => {
  const proposals = [
    {
      id: 1,
      title: '提高社区志愿者贡献币奖励',
      description: '将社区志愿者的贡献币奖励从每次 5 GXC 提高到 10 GXC',
      status: '投票中',
      yesVotes: 8456,
      noVotes: 1234,
      endTime: '2026-06-05',
    },
    {
      id: 2,
      title: '新增教育缴费服务',
      description: '在政务缴费中新增学费、杂费等教育相关缴费功能',
      status: '投票中',
      yesVotes: 6789,
      noVotes: 2345,
      endTime: '2026-06-10',
    },
    {
      id: 3,
      title: '调整小额借贷利率',
      description: '将小额借贷年利率从 4.5% 调整为 4.2%',
      status: '已通过',
      yesVotes: 12345,
      noVotes: 2345,
      endTime: '2026-05-25',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">DAO 治理</h1>
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">🏛️ 治理概览</h2>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <div className="text-sm text-gray-600">治理权 (GOV)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">参与投票</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600">发起提案</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">用户 50%</div>
            <div className="text-sm text-gray-600">席位占比</div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                <p className="text-gray-600 mt-1">{proposal.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                proposal.status === '投票中' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {proposal.status}
              </span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>赞成: {proposal.yesVotes}</span>
                <span>反对: {proposal.noVotes}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ 
                    width: `${(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">截止时间: {proposal.endTime}</span>
              {proposal.status === '投票中' && (
                <div className="space-x-3">
                  <button className="bg-success hover:bg-success/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    赞成
                  </button>
                  <button className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    反对
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          发起新提案
        </button>
      </div>
    </div>
  )
}

export default Governance
