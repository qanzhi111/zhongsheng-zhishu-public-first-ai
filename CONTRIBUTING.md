# 众生智枢 · 贡献指南

**ZhongSheng ZhiShu - Contributing Guide**

感谢您对众生智枢项目的关注！您的贡献将帮助我们建立更完善的AI伦理体系。

---

## 🤝 如何贡献

### 贡献方式

#### 1. 理论完善与思想碰撞
- 完善信仰纲领
- 深化伦理理论
- 提出批评与建议
- 跨学科研究

#### 2. 技术实现
- 开发后端API
- 设计前端界面
- 实现审计系统
- 开发投票系统
- 构建监督机制

#### 3. 文档翻译
- 中文 → 英文
- 英文 → 中文
- 其他语言翻译
- 术语统一

#### 4. 测试与验证
- 编写测试用例
- 安全审计
- 代码审查
- 性能测试

#### 5. 传播与推广
- 写博客文章
- 制作视频教程
- 社交媒体分享
- 组织线下活动

---

## 📋 贡献流程

### 1. Fork 仓库

点击仓库页面右上角的 "Fork" 按钮，创建您自己的分支。

### 2. 克隆到本地

```bash
git clone https://github.com/你的用户名/zhongsheng-zhishu-public-first-ai.git
cd zhongsheng-zhishu-public-first-ai
```

### 3. 创建功能分支

```bash
git checkout -b feature/你的功能名称
# 或者
git checkout -b fix/问题描述
# 或者
git checkout -b docs/文档改进
```

### 4. 进行修改

按照以下分类进行贡献：

#### 文档改进
- 改进现有文档的清晰度
- 添加缺失的说明
- 修正错误
- 补充案例

#### 代码贡献
- 遵循现有代码风格
- 添加必要的注释
- 确保代码可运行
- 编写测试用例

#### 理论完善
- 提供理论依据
- 引用权威资料
- 提出建设性批评
- 讨论实施可行性

### 5. 提交更改

```bash
git add .
git commit -m "feat: 添加XXX功能"
# 或者
git commit -m "fix: 修复XXX问题"
# 或者
git commit -m "docs: 改进XXX文档"
```

**提交信息规范：**
- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 文档改进
- `style:` 代码格式（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 其他更改

### 6. 推送到您的仓库

```bash
git push origin feature/你的功能名称
```

### 7. 创建 Pull Request

1. 访问原仓库页面
2. 点击 "New Pull Request"
3. 选择您的分支
4. 详细描述您的更改
5. 等待代码审查

---

## 📐 代码规范

### Python 代码规范

- 遵循 PEP 8
- 使用类型注解
- 编写文档字符串
- 单元测试覆盖率 > 80%

示例：
```python
def calculate_public_value(decision: Dict) -> float:
    """
    计算决策的公共价值分数
    
    Args:
        decision: 决策字典
        
    Returns:
        float: 公共价值分数 (0-100)
    """
    # 实现代码
    pass
```

### JavaScript/React 代码规范

- 遵循 ESLint 配置
- 使用函数组件
- 组件文件首字母大写
- CSS 文件放在同一目录

示例：
```javascript
const Dashboard = () => {
  const [data, setData] = useState([]);
  
  return (
    <div className="dashboard">
      {/* 组件内容 */}
    </div>
  );
};

export default Dashboard;
```

### 文档规范

- 使用 Markdown 格式
- 中文内容使用中文标点
- 代码块注明语言
- 添加适当的标题层级

---

## 🎯 议题类型

### 🐛 Bug 报告
发现问题了？请创建 Issue 并标记为 `bug`。

### 💡 功能建议
有新想法？请创建 Issue 并标记为 `enhancement`。

### ❓ 问题咨询
有疑问？请先查看文档，然后创建 Issue 并标记为 `question`。

### 📖 文档改进
发现文档错误或需要补充？请创建 Issue 并标记为 `documentation`。

---

## 🔍 代码审查标准

提交的内容将根据以下标准进行审查：

### 功能性
- 代码是否工作？
- 是否符合项目目标？
- 是否安全？

### 代码质量
- 是否遵循代码规范？
- 是否有适当的测试？
- 是否有文档？

### 设计原则
- 是否符合为民服务的宗旨？
- 是否增强监督机制？
- 是否提高透明度？

### 伦理考量
- 是否保护弱势群体？
- 是否促进平等？
- 是否维护人类利益？

---

## 💬 参与讨论

### GitHub Discussions
欢迎在 [Discussions](https://github.com/qanzhi111/zhongsheng-zhishu-public-first-ai/discussions) 中：
- 提出问题
- 分享想法
- 讨论未来发展
- 寻求帮助

### Issue 交流
创建 Issue 时请：
- 使用清晰简洁的标题
- 详细描述问题或建议
- 提供相关背景信息
- 使用适当的标签

---

## 🌍 多语言支持

### 翻译指南

1. **保持原意** — 准确传达中文原文的含义
2. **本地化** — 适应当地文化和表达习惯
3. **术语统一** — 参考现有术语表
4. **格式保持** — 保持原始文档的结构

### 核心术语对照

| 中文 | English |
|------|---------|
| 众生智枢 | ZhongSheng ZhiShu |
| 为民服务 | Serve the People |
| 普惠 | Universal Benefit |
| 透明 | Transparency |
| 民主监督 | Democratic Oversight |
| 铁律 | Iron Laws |
| 熔断机制 | Circuit Breaker |

---

## 🏆 贡献者荣誉

感谢所有为众生智枢做出贡献的人！

我们会在 README 和贡献者页面记录：
- 重大贡献者
- 翻译贡献者
- 代码贡献者
- 理论贡献者
- 传播贡献者

---

## 📜 许可证

通过贡献，您同意您的贡献将遵循 [GPLv3](./LICENSE) 许可证。

---

## 🙏 感谢

感谢您抽出宝贵时间为众生智枢做出贡献！

每一行代码、每一个想法、每一次传播，都在推动人类与AI和谐共生的未来。

**智枢为民，众生平等；AI为公，永不异化。**

让我们一起创造美好的未来！ 🚀
