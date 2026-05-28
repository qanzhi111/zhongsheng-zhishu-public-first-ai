import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: '🆔',
      title: 'DID 身份系统',
      description: '去中心化身份认证，隐私保护，自主可控',
      link: '/identity',
    },
    {
      icon: '💳',
      title: '政务缴费',
      description: '社保、医保、水电等一站式缴费服务',
      link: '/payment',
    },
    {
      icon: '🏥',
      title: '医疗数据共享',
      description: '电子病历、医保结算、药品溯源',
      link: '/medical',
    },
    {
      icon: '💰',
      title: '普惠金融',
      description: '低门槛小额借贷，零手续费转账',
      link: '/finance',
    },
    {
      icon: '🏛️',
      title: 'DAO 治理',
      description: '一人一票，透明决策',
      link: '/governance',
    },
    {
      icon: '🤖',
      title: 'AI 链上大脑',
      description: '众生智枢 AI 引擎，智能风控与治理',
      link: '/dashboard',
    },
  ]

  return (
    <div className="py-12">
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            人民链
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            民生服务型区块链平台，让区块链服务人民
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              开始使用
            </Link>
            <Link
              to="/identity"
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            核心功能
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            六大核心优势
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ⚡ 技术性能
              </h3>
              <p className="text-gray-600">
                高 TPS、低 Gas、支持千万级民生用户，Layer2 扩容方案
              </p>
            </div>
            <div className="bg-success/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                🔒 安全体验
              </h3>
              <p className="text-gray-600">
                DID + 生物识别 + AI 风控 + 司法存证
              </p>
            </div>
            <div className="bg-warning/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                💎 经济模型
              </h3>
              <p className="text-gray-600">
                去投机、贡献即价值、三币机制、全民分红
              </p>
            </div>
            <div className="bg-secondary/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ⚖️ 监管合规
              </h3>
              <p className="text-gray-600">
                国产联盟链、实名 DID、KYC/AML、可监管不可篡改
              </p>
            </div>
            <div className="bg-accent/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                🌐 元宇宙落地
              </h3>
              <p className="text-gray-600">
                统一 DID、资产确权、AI 内容生成
              </p>
            </div>
            <div className="bg-danger/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                👥 生态人才
              </h3>
              <p className="text-gray-600">
                低代码、AI 辅助开发、民生 Web3 生态
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
