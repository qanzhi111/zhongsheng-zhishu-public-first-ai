const Payment = () => {
  const services = [
    { name: '社保缴费', icon: '💼', amount: '580.00' },
    { name: '医保缴费', icon: '🏥', amount: '320.00' },
    { name: '水费', icon: '💧', amount: '45.50' },
    { name: '电费', icon: '⚡', amount: '128.30' },
    { name: '燃气费', icon: '🔥', amount: '68.00' },
    { name: '物业费', icon: '🏢', amount: '280.00' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">政务缴费</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{service.icon}</span>
                <span className="text-lg font-semibold">{service.name}</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{service.amount} RMBc</span>
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium transition-colors">
              立即缴费
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Payment
