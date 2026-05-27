import { useState } from "react";
import { Github, Twitter, MessageCircle, Mail, Code, GitBranch, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contribute() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("感谢您的参与！我们会尽快回复您。");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contributionSteps = [
    {
      title: "Fork 项目",
      description: "在 GitHub 上 Fork 众生智枢项目仓库到您的账户",
      icon: <GitBranch className="h-8 w-8 text-primary" />,
    },
    {
      title: "编写代码",
      description: "根据技术文档实现功能或修复问题",
      icon: <Code className="h-8 w-8 text-primary" />,
    },
    {
      title: "提交 Pull Request",
      description: "将您的代码变更提交 Pull Request 进行审核",
      icon: <GitBranch className="h-8 w-8 text-primary" />,
    },
    {
      title: "Code Review",
      description: "等待团队审核并解决可能的反馈",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
    },
    {
      title: "合并代码",
      description: "审核通过后，您的代码将被合并到主分支",
      icon: <Star className="h-8 w-8 text-primary" />,
    },
  ];

  const communityLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/zhongsheng-zhishu",
      description: "查看代码仓库",
    },
    {
      name: "Community",
      icon: <MessageCircle className="h-5 w-5" />,
      url: "https://discord.gg/zhongsheng",
      description: "加入社区讨论",
    },
    {
      name: "Twitter/X",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com/zhongsheng",
      description: "关注最新动态",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: "mailto:contact@zhongsheng.org",
      description: "联系我们",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 py-20">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            参与贡献
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            加入众生智枢社区，共同为人类与AI的和谐未来而努力
          </p>
        </div>

        {/* 贡献方式 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            多种参与方式
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "代码开发",
                desc: "参与核心功能开发、性能优化或修复Bug",
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "技术文档",
                desc: "完善技术文档、编写教程或翻译内容",
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "社区建设",
                desc: "参与社区讨论、回答问题或组织活动",
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "推广宣传",
                desc: "向更多人介绍众生智枢的理念和目标",
                color: "from-orange-500 to-yellow-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 贡献流程 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            贡献流程
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 连接线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/50 hidden md:block"></div>
              
              {contributionSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 mb-8">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{step.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 社区链接 */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            加入社区
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {communityLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">{link.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{link.name}</h3>
                <p className="text-muted-foreground">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 联系表单 */}
        <section className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            联系我们
          </h2>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  姓名
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  邮箱
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  主题
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="请输入主题"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  消息
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="请输入您的消息..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                发送消息
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
