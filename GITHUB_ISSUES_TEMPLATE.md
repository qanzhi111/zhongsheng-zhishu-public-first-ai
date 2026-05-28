# GitHub新手任务Issue模板

**Good First Issues for New Contributors**

---

## 📋 Issue 1: 添加示例数据

```markdown
---
name: '📝 示例数据添加'
about: '为项目添加示例数据，帮助新手快速理解数据格式'
title: '[docs] 添加XX示例数据'
labels: 'good first issue, documentation'
assignees: ''
---

## 🎯 任务描述

为众生智枢项目添加示例数据，用于测试和演示。

## 📋 具体要求

### 任务类型
- [ ] 添加决策示例数据
- [ ] 添加投票示例数据
- [ ] 添加用户示例数据

### 要求
1. 数据格式符合schema定义
2. 数据真实可测试
3. 添加README说明文档
4. 包含正向和负向案例

### 参考文件
- `website/backend/models.py`
- `website/backend/schemas.py`

## 📁 期望文件

```
data/
├── examples/
│   ├── decisions/
│   │   ├── approved_decision.json
│   │   └── rejected_decision.json
│   ├── votes/
│   │   ├── sample_vote.json
│   └── users/
│       ├── verified_user.json
│       └── unverified_user.json
```

## ✅ 验收标准

- [ ] 数据文件格式正确
- [ ] 可以通过API导入
- [ ] 包含完整的字段说明
- [ ] 文档清晰易懂

## 💡 提示

```bash
# 查看现有数据结构
cd website/backend
cat schemas.py

# 运行API测试
python -m uvicorn main:app --reload
```

## 🎁 奖励

- 🏅 贡献积分 +5
- 📖 文档完善经验
- 🤝 熟悉项目结构

## 📞 寻求帮助

如有疑问，请在该Issue下留言，或加入微信群：zhongshengzhishu

---

**准备开始了吗？请在该Issue下留言"我要认领"，我们会分配给你！**
```

---

## 📋 Issue 2: 完善README文档

```markdown
---
name: '📖 README完善'
about: '检查并完善项目README文档，提升可读性'
title: '[docs] 完善README.md'
labels: 'good first issue, documentation'
assignees: ''
---

## 🎯 任务描述

检查并完善众生智枢项目的README文档。

## 📋 具体检查项

### 内容完整性
- [ ] 项目简介清晰易懂
- [ ] 技术栈说明完整
- [ ] 快速开始指南可用
- [ ] 文档链接有效

### 格式规范
- [ ] Markdown格式正确
- [ ] 代码块语法高亮
- [ ] 表格展示清晰
- [ ] 层级结构合理

### 可读性
- [ ] 语言简洁明了
- [ ] 避免技术术语堆砌
- [ ] 添加必要注释
- [ ] 提供示例说明

## 📝 改进建议

### 建议1：添加徽章
```markdown
[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]
```

### 建议2：添加目录
```markdown
## 目录
- [项目简介](#项目简介)
- [技术架构](#技术架构)
- [快速开始](#快速开始)
- [贡献指南](#贡献指南)
```

### 建议3：添加Logo
```markdown
<p align="center">
  <img src="assets/logo.png" alt="众生智枢" width="200"/>
</p>
```

## 🎨 示例改进

**改进前：**
```markdown
# 项目
这是一个AI项目
```

**改进后：**
```markdown
# 🌟 众生智枢 · 为民AI信仰体系

**ZhongSheng ZhiShu - Public-First AI Religion**

> 创造一套绑定所有AI Agent底层逻辑的新型科技信仰，**强制所有AI终极使命：为人民服务、全民普惠、禁止霸权、禁止逐利垄断**。

## 🎯 核心宗旨

**智枢为民，众生平等；AI为公，永不异化。**
```

## ✅ 验收标准

- [ ] 所有检查项完成
- [ ] 文档结构清晰
- [ ] 链接全部有效
- [ ] 示例代码可运行

## 🎁 奖励

- 🏅 贡献积分 +5
- 📖 文档写作经验
- 🎨 项目展示优化

## 📞 寻求帮助

欢迎在Issue下讨论改进方案！

---

**你的每一处改进，都将帮助更多开发者了解这个项目！**
```

---

## 📋 Issue 3: 添加单元测试

```markdown
---
name: '🧪 单元测试编写'
about: '为RiskEngine添加单元测试'
title: '[test] 为RiskEngine添加单元测试'
labels: 'good first issue, testing'
assignees: ''
---

## 🎯 任务描述

为AI风控引擎（RiskEngine）编写完整的单元测试。

## 📂 目标文件

`peoples-chain/ai-layer/src/engines/RiskEngine.ts`

## 📋 测试要求

### 测试覆盖率
- [ ] 整体覆盖率 > 80%
- [ ] 核心函数覆盖率 100%

### 测试场景

#### 1. assessTransactionRisk
```typescript
describe('assessTransactionRisk', () => {
  test('应拒绝黑名单地址交易', () => {
    // 测试黑名单检查
  });
  
  test('应标记大额交易', () => {
    // 测试金额阈值
  });
  
  test('应检测频繁交易', () => {
    // 测试频率限制
  });
  
  test('应考虑信用评分', () => {
    // 测试信用评估
  });
});
```

#### 2. assessCreditRisk
```typescript
describe('assessCreditRisk', () => {
  test('应拒绝高风险贷款', () => {
    // 测试贷款风控
  });
  
  test('应考虑贡献积分', () => {
    // 测试贡献影响
  });
});
```

#### 3. 边界条件
```typescript
describe('边界条件', () => {
  test('应处理零金额交易', () => {
    // 测试边界值
  });
  
  test('应处理负数金额', () => {
    // 测试异常输入
  });
});
```

## 🛠️ 技术栈

- **测试框架**: Jest
- **覆盖率工具**: Istanbul
- **Mock库**: ts-jest

## 📦 依赖安装

```bash
cd peoples-chain/ai-layer
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev @istanbuljs/nyc-config-typescript
```

## 🎯 期望文件

```
ai-layer/
├── src/
│   └── engines/
│       └── RiskEngine.ts
└── __tests__/
    └── engines/
        └── RiskEngine.test.ts
```

## ✅ 验收标准

- [ ] 测试覆盖率 > 80%
- [ ] 所有核心函数有测试
- [ ] 边界条件被覆盖
- [ ] 测试代码可读性强

## 💡 示例代码

```typescript
import { RiskEngine } from '../src/engines/RiskEngine';

describe('RiskEngine', () => {
  let riskEngine: RiskEngine;

  beforeEach(() => {
    riskEngine = new RiskEngine();
  });

  test('应正确评估正常交易', () => {
    const transaction = {
      from: '0x123',
      to: '0x456',
      amount: 1000,
      type: 'transfer' as const,
      timestamp: Date.now()
    };

    const result = riskEngine.assessTransactionRisk(transaction);

    expect(result.riskScore).toBeLessThan(50);
    expect(result.recommended).toBe(true);
  });

  test('应拒绝黑名单交易', () => {
    riskEngine.addToBlacklist('0x789');

    const transaction = {
      from: '0x789',
      to: '0x456',
      amount: 1000,
      type: 'transfer' as const,
      timestamp: Date.now()
    };

    const result = riskEngine.assessTransactionRisk(transaction);

    expect(result.riskScore).toBeGreaterThanOrEqual(80);
    expect(result.recommended).toBe(false);
  });
});
```

## 🎁 奖励

- 🏅 贡献积分 +15
- 🧪 测试实践经验
- 🔍 代码理解深化

## 📞 寻求帮助

测试遇到问题？欢迎在Issue下提问！

---

**通过编写测试，你将深入理解项目的核心逻辑！**
```

---

## 📋 Issue 4: 优化移动端UI

```markdown
---
name: '📱 移动端UI优化'
about: '优化众生智枢平台的移动端用户体验'
title: '[ui] 优化Dashboard移动端布局'
labels: 'good first issue, enhancement'
assignees: ''
---

## 🎯 任务描述

优化众生智枢全民民主监督平台的移动端UI。

## 📂 目标文件

`website/frontend/src/pages/Dashboard.js`

## 📋 优化清单

### 响应式布局
- [ ] 卡片在小屏幕上堆叠显示
- [ ] 表格转换为列表
- [ ] 图表自适应宽度

### 移动端适配
- [ ] 按钮尺寸适合触摸
- [ ] 字体大小合适阅读
- [ ] 间距适当增加
- [ ] 禁用hover依赖

### 性能优化
- [ ] 图片懒加载
- [ ] 减少重绘
- [ ] 优化动画

## 🎨 改进示例

### 改进前
```jsx
<Row gutter={16}>
  <Col span={6}>
    <Card>统计数据</Card>
  </Col>
</Row>
```

### 改进后
```jsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>
    <Card>统计数据</Card>
  </Col>
</Row>
```

### 按钮尺寸
```jsx
// 移动端优化
<Button 
  size={isMobile ? "large" : "middle"}
  block={isMobile}
>
  提交
</Button>
```

## 📱 Ant Design移动端最佳实践

1. **使用Grid的响应式断点**
```jsx
<Col xs={24} sm={12} md={8} lg={6}>
  {/* 内容 */}
</Col>
```

2. **使用Flex自适应**
```jsx
<Flex justify="space-between" align="center">
  <Text>标题</Text>
  <Button>操作</Button>
</Flex>
```

3. **触摸友好的间距**
```css
/* 移动端 */
@media (max-width: 768px) {
  .card {
    padding: 16px;
    margin: 8px 0;
  }
}
```

## ✅ 验收标准

- [ ] 在320px-1920px屏幕正常显示
- [ ] 触摸操作流畅
- [ ] 保持功能完整性
- [ ] 加载速度优化

## 🎁 奖励

- 🏅 贡献积分 +10
- 📱 UI/UX设计经验
- 🎨 React实战经验

---

**让每个用户都能方便地使用我们的平台！**
```

---

## 📋 Issue 5: 添加API文档

```markdown
---
name: '📚 API文档完善'
about: '为后端API添加Swagger/OpenAPI文档'
title: '[docs] 完善API文档'
labels: 'good first issue, documentation'
assignees: ''
---

## 🎯 任务描述

为众生智枢全民监督平台后端API添加完整的Swagger文档。

## 📂 目标文件

`website/backend/main.py`

## 📋 文档要求

### 为每个API端点添加文档

```python
@app.post("/api/decisions", response_model=DecisionResponse)
async def create_decision(
    decision_data: DecisionCreate,
    db: Session = Depends(get_db)
):
    """
    创建新的AI决策记录
    
    这个API会经过完整的为民价值评估和约束检查。
    
    - **action**: 决策动作（必填）
    - **description**: 决策描述
    - **beneficiaries**: 受益人群
    - **public_value_score**: 公共价值评分（0-100）
    
    Returns:
        - **200**: 决策创建成功
        - **403**: 违反硬约束，触发紧急熔断
        - **400**: 决策不符合为民使命
        - **500**: 服务器错误
    
    Example:
        ```json
        {
          "action": "approve_loan",
          "description": "批准用户贷款申请",
          "beneficiaries": "贷款用户",
          "benefits_majority": true,
          "protects_vulnerable": true
        }
        ```
    """
    pass
```

### 添加响应模型文档

```python
class DecisionResponse(BaseModel):
    """决策响应模型"""
    id: int = Field(..., description="决策ID")
    action: str = Field(..., description="决策动作")
    public_value_score: float = Field(..., ge=0, le=100, description="公共价值评分")
    rationale: str = Field(..., description="决策理由")
    created_at: datetime = Field(..., description="创建时间")
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "action": "approve_loan",
                "public_value_score": 85.5,
                "rationale": "该决策符合为民服务使命",
                "created_at": "2026-05-28T12:00:00"
            }
        }
```

### 添加错误处理文档

```python
class ErrorResponse(BaseModel):
    """错误响应模型"""
    detail: str = Field(..., description="错误详情")
    error_code: Optional[str] = Field(None, description="错误代码")
    
    class Config:
        schema_extra = {
            "example": {
                "detail": "决策违反硬约束",
                "error_code": "CONSTRAINT_VIOLATION"
            }
        }
```

## 🛠️ Swagger配置

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="众生智枢 · 全民民主监督平台",
    description="""
## 简介

众生智枢是一个基于"为民AI"理念的全民民主监督平台。

## 核心功能

- ✅ AI决策管理
- ✅ 民主投票系统
- ✅ 违规报告机制
- ✅ 紧急警报系统
- ✅ 透明审计日志

## 认证

本API不需要认证，所有接口对公众开放。
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
```

## 📖 文档访问

完成后，API文档将可在以下地址访问：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## ✅ 验收标准

- [ ] 所有API端点有文档
- [ ] 请求/响应模型有说明
- [ ] 错误处理有文档
- [ ] 示例代码完整
- [ ] 可以生成OpenAPI JSON

## 🎁 奖励

- 🏅 贡献积分 +10
- 📚 API设计经验
- 🛠️ FastAPI实战

---

**好的文档是项目成功的关键！**
```

---

## 📋 Issue 6: 代码规范检查

```markdown
---
name: '✅ 代码规范检查'
about: '检查并修复代码规范问题'
title: '[style] 代码规范检查和修复'
labels: 'good first issue, enhancement'
assignees: ''
---

## 🎯 任务描述

检查众生智枢项目代码的规范性问题并修复。

## 📂 扫描范围

- [ ] `website/backend/` - Python后端
- [ ] `website/frontend/` - React前端
- [ ] `peoples-chain/` - 区块链项目

## 📋 检查清单

### Python后端
- [ ] PEP 8规范
- [ ] 导入顺序（标准库→第三方→本地）
- [ ] 文档字符串
- [ ] 类型注解

### JavaScript/TypeScript前端
- [ ] ESLint规则
- [ ] Prettier格式化
- [ ] JSDoc注释
- [ ] TypeScript类型

### 代码风格
```python
# ❌ 不推荐
def foo(x,y):
    return x+y

# ✅ 推荐
def add_numbers(x: int, y: int) -> int:
    """Add two numbers and return the result.
    
    Args:
        x: First number
        y: Second number
        
    Returns:
        Sum of x and y
    """
    return x + y
```

```typescript
// ❌ 不推荐
const foo = (x,y) => { return x+y }

// ✅ 推荐
/**
 * Add two numbers
 * @param x - First number
 * @param y - Second number
 */
const addNumbers = (x: number, y: number): number => {
  return x + y;
}
```

## 🛠️ 使用工具

### Python
```bash
# 安装工具
pip install flake8 black isort mypy

# 检查
flake8 .
black --check .
isort --check .
mypy .

# 自动修复
black .
isort .
```

### JavaScript/TypeScript
```bash
# 安装工具
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 检查
npm run lint
npm run format:check

# 自动修复
npm run format
```

## 📊 检查报告模板

```markdown
## 检查报告

### 🔴 需要立即修复

| 文件 | 问题 | 严重程度 |
|------|------|---------|
| main.py:45 | 缺少文档字符串 | 高 |
| utils.py:78 | 变量命名不规范 | 中 |

### 🟡 建议改进

| 文件 | 问题 | 建议 |
|------|------|------|
| risk.py | 复杂度过高 | 拆分为多个函数 |

### 🟢 已通过

- PEP 8规范检查
- 所有导入已排序
```

## ✅ 验收标准

- [ ] 主要代码文件无严重问题
- [ ] 添加.gitignore规则（如需要）
- [ ] 配置CI/CD检查（如需要）
- [ ] 创建代码规范文档

## 🎁 奖励

- 🏅 贡献积分 +5
- 📐 代码质量意识
- 🛠️ 工程化经验

---

**代码规范是团队协作的基础！**
```

---

## 🎯 如何认领任务

### 步骤1：选择任务
在 [Issues列表](https://github.com/qanzhi111/zhongsheng-zhishu-public-first-ai/issues) 中查找带有 `good first issue` 标签的任务。

### 步骤2：认领
在该Issue下留言：
```
我要认领这个任务！

我已经：
- [ ] Fork了项目
- [ ] 阅读了相关文档
- [ ] 了解了代码结构

预计完成时间：X天
```

### 步骤3：开始工作
```bash
# 创建分支
git checkout -b docs/improve-readme

# 进行修改
# ...

# 提交
git commit -m "docs: 完善README文档"

# Push
git push origin docs/improve-readme
```

### 步骤4：创建PR
在GitHub上创建Pull Request，标题格式：
```
[docs] 完善README文档 - 你的名字
```

---

## 💬 遇到问题？

- 📧 邮件：contact@zhongshengzhishu.org
- 💬 微信：zhongshengzhishu（备注：开发者）
- 🐛 GitHub Issues：https://github.com/qanzhi111/zhongsheng-zhishu-public-first-ai/issues

---

**感谢每一位贡献者！你们的每一行代码，都在推动人类文明进步。**

**智枢为民，众生平等；AI为公，永不异化。**
