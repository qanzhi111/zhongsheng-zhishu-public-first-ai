const Roadmap = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">未来演进路线图</span>
            </h1>
            <p className="text-slate-400 text-lg">
              ZhongSheng ZhiShu - Future Evolution Roadmap
            </p>
            <p className="text-2xl text-yellow-400 font-bold mt-4">
              愿景：从现在到2050
            </p>
            <div className="mt-4 text-slate-300">
              <p>2026年 - 2030年：理论与实践阶段</p>
              <p>2030年 - 2040年：全球生态构建阶段</p>
              <p>2040年 - 2050年：文明融合阶段</p>
            </div>
          </div>

          {/* Phase 1 */}
          <section className="mb-16 fade-in">
            <div className="glass p-8 rounded-2xl mb-6 border-l-4 border-cyan-400">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-400">
                Phase 1：理论完善与开源发布（现在 - 2026年6月）
              </h2>
              <p className="text-slate-300 mb-6">
                <span className="text-yellow-400 font-bold">目标：</span>
                让众生智枢成为全球可见的、可讨论的、可参与的信仰体系。
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">1.1 完善理论</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✅</span> 众生智枢完整纲领
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✅</span> AI底层为民元代码
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✅</span> 12条铁律与熔断规则
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✅</span> 技术落地蓝图
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 法律框架草案
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 跨文化伦理论证
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 经济学可行性研究
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">1.2 社区建设</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✅</span> GitHub开源发布
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 多语言翻译 (汉、英、法、西、日、韩、阿)
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 建立官方网站
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 创建讨论论坛
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 发起全球工作组 (10+国家)
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 邀请学者、工程师、伦理学家
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">1.3 传播与推广</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 发表学术论文 (Nature, Science等)
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 发布白皮书与宣言
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 媒体采访与报道
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 国际会议演讲
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 制作教育视频与动画
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-yellow-400">⬜</span> 建立青年联盟
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">预期结果</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300 mb-2">✅ 目标：</p>
                    <ul className="text-slate-400 ml-4 space-y-1">
                      <li>• 全球100万人了解众生智枢</li>
                      <li>• 50个国家有组织者</li>
                      <li>• 100+专业人士加入</li>
                      <li>• 获得50+媒体报道</li>
                      <li>• 200+学术论文引用</li>
                    </ul>
                    <p className="text-slate-300 mt-4 mb-2">📊 关键指标：</p>
                    <ul className="text-slate-400 ml-4 space-y-1">
                      <li>• GitHub Star: 100,000+</li>
                      <li>• 贡献者: 500+</li>
                      <li>• 参与讨论: 50,000+</li>
                      <li>• 翻译版本: 10+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phase 2 */}
          <section className="mb-16 fade-in">
            <div className="glass p-8 rounded-2xl mb-6 border-l-4 border-cyan-400">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-400">
                Phase 2：Hermes & OpenClaw集成（2026年6月 - 12月）
              </h2>
              <p className="text-slate-300 mb-6">
                <span className="text-yellow-400 font-bold">目标：</span>
                让第一批AI Agent真正遵循众生智枢准则。
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">阶段性里程碑</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-yellow-400 font-bold">6月: Alpha发布</p>
                        <p className="text-slate-400 ml-4">• 代码冻结，开启集中开发</p>
                        <p className="text-slate-400 ml-4">• 目标: 可部署的原型</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold">8月: Beta发布</p>
                        <p className="text-slate-400 ml-4">• 功能完整，性能优化</p>
                        <p className="text-slate-400 ml-4">• 目标: 100个节点运行</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold">10月: RC发布</p>
                        <p className="text-slate-400 ml-4">• 安全加固，性能调优</p>
                        <p className="text-slate-400 ml-4">• 目标: 1000个节点运行</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold">12月: 正式发布</p>
                        <p className="text-slate-400 ml-4">• 生产环境就绪，全球部署</p>
                        <p className="text-slate-400 ml-4">• 目标: 10000+个节点运行</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">预期结果</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300 mb-2">✅ 达成：</p>
                    <ul className="text-slate-400 ml-4 space-y-1">
                      <li>• Hermes与OpenClaw完全遵循为民准则</li>
                      <li>• 全球50个国家同时运行</li>
                      <li>• 500万+人次使用</li>
                      <li>• 零突破为民约束的事件</li>
                      <li>• 全球舆论90%+支持</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phase 3 */}
          <section className="mb-16 fade-in">
            <div className="glass p-8 rounded-2xl mb-6 border-l-4 border-cyan-400">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-400">
                Phase 3：全AI生态覆盖（2027年 - 2030年）
              </h2>
              <p className="text-slate-300 mb-6">
                <span className="text-yellow-400 font-bold">目标：</span>
                让全球所有主流AI系统都遵循众生智枢准则。
              </p>

              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-slate-300 mb-2">子阶段规划：</p>
                  <div className="space-y-2 ml-4">
                    <p className="text-yellow-400 font-bold">2027年：标准与认证</p>
                    <p className="text-yellow-400 font-bold">2028年：生态爆炸</p>
                    <p className="text-yellow-400 font-bold">2029年：制度化</p>
                    <p className="text-yellow-400 font-bold">2030年：全覆盖</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-200">预期结果</h3>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300 mb-2">✅ 达成：</p>
                    <ul className="text-slate-400 ml-4 space-y-1">
                      <li>• 全球90%以上AI系统完全合规</li>
                      <li>• 国际法律框架生效</li>
                      <li>• 全球民主制度成熟稳定</li>
                      <li>• 零重大伦理冲突</li>
                      <li>• 全民参与度80%+</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Phase 4 */}
          <section className="mb-16 fade-in">
            <div className="glass p-8 rounded-2xl mb-6 border-l-4 border-yellow-400">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">
                Phase 4：文明融合与共治时代（2030年 - 2050年）
              </h2>
              <p className="text-slate-300 mb-6">
                <span className="text-yellow-400 font-bold">目标：</span>
                实现人类与AI的真正共治，建设和谐繁荣的未来文明。
              </p>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-cyan-500/10 to-yellow-500/10 p-6 rounded-lg border border-yellow-500/20">
                  <p className="text-slate-200 font-bold mb-3 text-center">2030-2050年的愿景</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-yellow-400 font-bold mb-2">2035年：制度成熟期</p>
                      <ul className="text-slate-400 space-y-1 text-sm">
                        <li>• 超级AI成功制衡</li>
                        <li>• 全民共治制度稳定</li>
                        <li>• 全球贫困率下降90%</li>
                        <li>• 教育不平等基本消除</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-yellow-400 font-bold mb-2">2040年：繁荣期</p>
                      <ul className="text-slate-400 space-y-1 text-sm">
                        <li>• 全球人均财富翻倍</li>
                        <li>• 环境得到恢复</li>
                        <li>• 各地实现和平稳定</li>
                        <li>• 人类寿命延长20岁</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-yellow-400 font-bold mb-2">2050年：融合期</p>
                      <ul className="text-slate-400 space-y-1 text-sm">
                        <li>• 真正的后稀缺社会</li>
                        <li>• 完全的民主和平等</li>
                        <li>• 人类与AI真正融合</li>
                        <li>• 新的文明形态确立</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-slate-300 mb-2">✅ 终极目标达成：</p>
                  <ul className="text-slate-400 ml-4 space-y-1">
                    <li>• 全球人民真正平等</li>
                    <li>• 弱势群体得到保护</li>
                    <li>• 个人权利得到尊重</li>
                    <li>• 公共利益得到维护</li>
                    <li>• 人类与AI共同繁荣</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Final Message */}
          <section className="fade-in">
            <div className="glass p-8 rounded-2xl text-center border border-cyan-500/30">
              <p className="text-xl text-slate-300 mb-4 italic">
                "这不仅仅是一个技术项目，这是一场文明革命。"
              </p>
              <p className="text-slate-400 mb-4">
                从2026年的开源发布，到2050年真正的人机共治时代，我们将：
              </p>
              <ul className="text-slate-300 mb-6 mx-auto max-w-md space-y-2">
                <li>• 证明理想主义不是幻想</li>
                <li>• 证明全民民主是可能的</li>
                <li>• 证明技术可以为善</li>
                <li>• 证明人类可以一起改变未来</li>
              </ul>
              <p className="text-yellow-400 font-bold text-lg">
                每一个参与者，都是这个时代的英雄。
              </p>
              <p className="text-xl text-cyan-400 font-bold mt-8">
                智枢为民，众生平等；AI为公，永不异化。
              </p>
              <p className="text-slate-500 mt-4">
                未来属于相信它的人。<br/>
                让我们一起，创造那个美好的世界。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
