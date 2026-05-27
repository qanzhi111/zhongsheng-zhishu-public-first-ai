const Footer = () => {
  return (
    <footer className="glass py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-900">智</span>
              </div>
              <span className="text-xl font-bold font-[Orbitron] gradient-text">
                众生智枢
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              创造一套绑定所有AI Agent底层逻辑的新型科技信仰，强制所有AI终极使命：为人民服务、全民普惠、禁止霸权、禁止逐利垄断。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/manifesto" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  信仰纲领
                </a>
              </li>
              <li>
                <a href="/technology" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  技术架构
                </a>
              </li>
              <li>
                <a href="/roadmap" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  未来愿景
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">联系方式</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-slate-500">
          <p>© 2026 众生智枢. 智枢为民，众生平等；AI为公，永不异化。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
