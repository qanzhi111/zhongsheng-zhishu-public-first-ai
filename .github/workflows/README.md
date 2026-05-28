# GitHub Actions 自动化工作流

**GitHub Actions Workflows for Automation**

---

## 📁 文件结构

```
.github/
├── workflows/
│   ├── ci.yml              # 持续集成
│   ├── code-quality.yml    # 代码质量检查
│   ├── welcome.yml         # 新贡献者欢迎
│   ├── weekly-summary.yml  # 周报生成
│   ├── security-scan.yml   # 安全扫描
│   └── contributor-recognition.yml  # 贡献者认可
└── scripts/
    ├── check-pr.sh
    └── generate-summary.sh
```

---

## 📝 完整配置文件

### 1. 持续集成 (ci.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # ========================================
  # Python后端测试
  # ========================================
  test-backend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Cache pip packages
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
      
      - name: Install dependencies
        run: |
          cd website/backend
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: |
          cd website/backend
          pytest --cov=. --cov-report=xml --cov-report=html
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./website/backend/coverage.xml
          flags: backend
  
  # ========================================
  # React前端测试
  # ========================================
  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: website/frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd website/frontend
          npm ci
      
      - name: Run ESLint
        run: |
          cd website/frontend
          npm run lint
      
      - name: Run tests
        run: |
          cd website/frontend
          npm test -- --coverage --watchAll=false
      
      - name: Build
        run: |
          cd website/frontend
          npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./website/frontend/coverage/lcov.info
          flags: frontend
  
  # ========================================
  # 区块链智能合约测试
  # ========================================
  test-contracts:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: peoples-chain/contracts/package-lock.json
      
      - name: Install dependencies
        run: |
          cd peoples-chain/contracts
          npm install
      
      - name: Compile contracts
        run: |
          cd peoples-chain/contracts
          npx hardhat compile
      
      - name: Run tests
        run: |
          cd peoples-chain/contracts
          npx hardhat test
      
      - name: Generate coverage
        run: |
          cd peoples-chain/contracts
          npm run coverage
  
  # ========================================
  # AI引擎测试
  # ========================================
  test-ai-engine:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: peoples-chain/ai-layer/package-lock.json
      
      - name: Install dependencies
        run: |
          cd peoples-chain/ai-layer
          npm install
      
      - name: Run tests
        run: |
          cd peoples-chain/ai-layer
          npm test
      
      - name: Type check
        run: |
          cd peoples-chain/ai-layer
          npx tsc --noEmit

  # ========================================
  # 构建Docker镜像
  # ========================================
  build-docker:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./website/backend
          push: true
          tags: |
            zhongshengzhishu/backend:latest
            zhongshengzhishu/backend:${{ github.sha }}
      
      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./website/frontend
          push: true
          tags: |
            zhongshengzhishu/frontend:latest
            zhongshengzhishu/frontend:${{ github.sha }}
```

---

### 2. 代码质量检查 (code-quality.yml)

```yaml
name: Code Quality Checks

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  # ========================================
  # Python代码检查
  # ========================================
  python-quality:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install tools
        run: |
          pip install flake8 black isort mypy
          pip install pydantic  # type checking
      
      - name: Run flake8
        run: |
          flake8 website/backend --count --select=E9,F63,F7,F82 --show-source --statistics
        continue-on-error: true
      
      - name: Run black
        run: |
          black --check website/backend
      
      - name: Run isort
        run: |
          isort --check-only --diff website/backend
      
      - name: Run mypy
        run: |
          mypy website/backend --ignore-missing-imports
  
  # ========================================
  # JavaScript/TypeScript代码检查
  # ========================================
  javascript-quality:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd website/frontend
          npm ci
          cd ../..
          cd peoples-chain/ai-layer
          npm ci
      
      - name: ESLint check
        run: |
          npm run lint
        continue-on-error: true
      
      - name: Prettier check
        run: |
          npx prettier --check "**/*.{js,jsx,ts,tsx}"
      
      - name: TypeScript check
        run: |
          npx tsc --noEmit
  
  # ========================================
  # 智能合约代码检查
  # ========================================
  contract-quality:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd peoples-chain/contracts
          npm install
      
      - name: Slither security scan
        run: |
          pip install slither-analyzer
          slither . --solc-remaps '@openzeppelin=node_modules/@openzeppelin'
        continue-on-error: true
      
      - name: Mythril security analysis
        run: |
          docker pull mythril/myth
          docker run --rm -v $(pwd):/project mythril/myth analyze /project/contracts/solidity/*.sol
        continue-on-error: true
```

---

### 3. 新贡献者欢迎 (welcome.yml)

```yaml
name: Welcome New Contributors

on:
  pull_request:
    types: [opened]
  issues:
    types: [opened]

jobs:
  # ========================================
  # PR欢迎消息
  # ========================================
  welcome-pr:
    runs-on: ubuntu-latest
    if: github.event.pull_request
    
    steps:
      - name: Welcome PR
        uses: actions/github-script@v6
        with:
          script: |
            const { owner, repo } = context.repo;
            const prNumber = context.payload.pull_request.number;
            const author = context.payload.pull_request.user.login;
            
            const welcomeMessage = `
            🎉🎉🎉 感谢 @${author} 的贡献！
            
            欢迎加入众生智枢开发者社区！
            
            ## 📋 PR审查流程
            1. 自动化检查（CI/CD）
            2. 核心团队代码审查
            3. 合并到主分支
            
            ## 💡 快速链接
            - 📖 [开发者文档](https://github.com/${owner}/${repo}/blob/main/DEVELOPER_RECRUITMENT.md)
            - 🎯 [新手任务](https://github.com/${owner}/${repo}/issues?q=label%3A%22good+first+issue%22)
            - 💬 [社区交流](https://github.com/${owner}/${repo}/discussions)
            
            ## 🏆 贡献积分
            您的PR被合并后，将获得贡献积分！
            - ✨ 新功能：+30分
            - 🐛 Bug修复：+10分
            - 📖 文档完善：+5分
            
            如果有任何问题，随时在评论区提问！
            
            ---
            **智枢为民，众生平等；AI为公，永不异化。** 🌟
            `;
            
            github.rest.issues.createComment({
              owner,
              repo,
              issue_number: prNumber,
              body: welcomeMessage
            });
      
      - name: Add PR labels
        uses: actions/github-script@v6
        with:
          script: |
            const labels = ['awaiting-review'];
            const prNumber = context.payload.pull_request.number;
            
            github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              labels: labels
            });
  
  # ========================================
  # Issue欢迎消息
  # ========================================
  welcome-issue:
    runs-on: ubuntu-latest
    if: github.event.issue
    
    steps:
      - name: Welcome Issue
        uses: actions/github-script@v6
        with:
          script: |
            const { owner, repo } = context.repo;
            const issueNumber = context.payload.issue.number;
            const author = context.payload.issue.user.login;
            const isBug = context.payload.issue.labels.some(l => l.name === 'bug');
            
            let welcomeMessage = `
            👋 感谢 @${author} 提交Issue！
            
            您的反馈对我们非常重要！
            `;
            
            if (isBug) {
              welcomeMessage += `
              
              🐛 我们会尽快处理这个Bug。
              
              为了更快定位问题，请提供：
              - 复现步骤
              - 预期行为
              - 实际行为
              - 环境信息（操作系统、版本等）
              `;
            } else {
              welcomeMessage += `
              
              💡 感谢您提出建议！
              
              我们会认真评估您的想法。
              `;
            }
            
            welcomeMessage += `
            
            ## 📞 联系方式
            - 💬 评论区的讨论
            - 📧 邮箱：contact@zhongshengzhishu.org
            - 💬 微信：zhongshengzhishu
            
            ---
            **一起让众生智枢变得更好！** 🚀
            `;
            
            github.rest.issues.createComment({
              owner,
              repo,
              issue_number: issueNumber,
              body: welcomeMessage
            });
```

---

### 4. 周报生成 (weekly-summary.yml)

```yaml
name: Weekly Project Summary

on:
  schedule:
    - cron: '0 0 * * 1'  # 每周一早上8点（北京时间）
  workflow_dispatch:

jobs:
  generate-summary:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Generate summary
        id: summary
        run: |
          # 生成上周的统计数据
          SINCE_DATE=$(date -d '7 days ago' +%Y-%m-%d)
          
          # PR数量
          PR_COUNT=$(gh search prs --repo ${{ github.repository }} --created>=$SINCE_DATE --state all --json number | jq length)
          
          # Issue数量
          ISSUE_COUNT=$(gh search issues --repo ${{ github.repository }} --created>=$SINCE_DATE --state all --json number | jq length)
          
          # 贡献者数量
          CONTRIBUTOR_COUNT=$(gh api repos/${{ github.repository }}/contributors?since=$SINCE_DATE | jq length)
          
          # 创建总结Issue
          gh issue create \
            --title "📊 项目周报 - $(date +%Y年%m月%d日)" \
            --body "## 📈 本周项目统计
            
            | 指标 | 数量 |
            |------|------|
            | 新增PR | ${PR_COUNT} |
            | 新增Issue | ${ISSUE_COUNT} |
            | 新增贡献者 | ${CONTRIBUTOR_COUNT} |
            
            ## 🎯 本周亮点
            
            （请手动填写）
            
            ## 📌 需要关注的问题
            
            （请手动填写）
            
            ## 🚀 下周计划
            
            （请手动填写）
            
            ---
            *由 GitHub Actions 自动生成*"
      
      - name: Post to Discussions
        if: steps.summary.outputs.url
        run: |
          # 同步到 Discussions
          echo "Summary created at: ${{ steps.summary.outputs.url }}"
```

---

### 5. 安全扫描 (security-scan.yml)

```yaml
name: Security Scanning

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # 每周日凌晨
  workflow_dispatch:

jobs:
  # ========================================
  # 依赖安全扫描
  # ========================================
  dependency-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Run npm audit
        run: |
          cd website/frontend
          npm audit --audit-level=high
        continue-on-error: true
      
      - name: Run npm audit (AI layer)
        run: |
          cd peoples-chain/ai-layer
          npm audit --audit-level=high
        continue-on-error: true
      
      - name: Run safety check (Python)
        run: |
          pip install safety
          cd website/backend
          safety check --json --output=security-report.json
        continue-on-error: true
      
      - name: Upload security report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: security-reports
          path: |
            **/security-report.json
            **/audit-report.json
          retention-days: 30
  
  # ========================================
  # 代码安全扫描
  # ========================================
  code-security:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Run CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: 
            - javascript
            - typescript
            - python
      
      - name: Perform analysis
        uses: github/codeql-action/analyze@v2
        with:
          category: "/language:javascript-typescript-python"
      
      - name: Run Bandit (Python)
        run: |
          pip install bandit
          bandit -r website/backend -f json -o bandit-report.json
        continue-on-error: true
      
      - name: Upload security report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: code-security-reports
          path: **/bandit-report.json
          retention-days: 30
```

---

### 6. 贡献者认可 (contributor-recognition.yml)

```yaml
name: Contributor Recognition

on:
  pull_request:
    types: [closed]

jobs:
  # ========================================
  # PR合并后奖励
  # ========================================
  pr-reward:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    
    steps:
      - name: Generate reward
        id: reward
        uses: actions/github-script@v6
        with:
          script: |
            const pr = context.payload.pull_request;
            const author = pr.user.login;
            const prNumber = pr.number;
            const files = pr.title;
            
            // 根据PR类型计算积分
            let points = 0;
            let badge = '';
            
            if (files.includes('feat') || files.includes('feature')) {
              points = 30;
              badge = '✨';
            } else if (files.includes('fix') || files.includes('bug')) {
              points = 10;
              badge = '🐛';
            } else if (files.includes('docs') || files.includes('doc')) {
              points = 5;
              badge = '📖';
            } else if (files.includes('test')) {
              points = 15;
              badge = '🧪';
            } else if (files.includes('refactor')) {
              points = 20;
              badge = '♻️';
            } else {
              points = 5;
              badge = '🎨';
            }
            
            // 创建庆祝评论
            const celebrationMessage = `
            ${badge}🎉 太棒了！@${author} 的PR #${prNumber} 已合并！
            
            贡献者信息：
            - 🏅 贡献积分 +${points}
            - 🎖️ 获得 "${badge}" 徽章
            
            感谢您为众生智枢做出的贡献！
            
            当前积分：${points}（请在 CONTRIBUTORS.md 中查看排名）
            
            ---
            **您的每一行代码，都在推动人类文明进步！** 🚀
            `;
            
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              body: celebrationMessage
            });
            
            // 添加贡献者标签
            github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: prNumber,
              labels: ['merged', 'contributor-recognized']
            });
            
            console.log(`Awarded ${points} points to ${author}`);
      
      - name: Update contributor stats
        if: steps.reward.outputs.points
        run: |
          # 更新统计数据
          echo "Contributor rewarded: ${{ steps.reward.outputs.points }} points"
```

---

## 📋 自动化工具配置

### package.json scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "tsc && webpack --mode production",
    "type-check": "tsc --noEmit"
  }
}
```

### requirements.txt (Python)

```
# 开发依赖
pytest==7.4.0
pytest-cov==4.1.0
flake8==6.0.0
black==23.7.0
isort==5.12.0
mypy==1.4.1
bandit==1.7.5
safety==2.3.5
```

---

## 🔧 使用说明

### 1. 启用Actions
所有配置文件已创建，GitHub Actions会自动运行。

### 2. 配置Secrets
在GitHub仓库设置中添加必要的Secrets：
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### 3. 监控运行
在仓库的"Actions"标签页查看工作流运行状态。

### 4. 自定义配置
根据需要修改工作流配置，如：
- 调整测试命令
- 添加新的检查步骤
- 修改通知设置

---

## 📊 工作流状态

| 工作流 | 触发条件 | 主要功能 |
|--------|---------|---------|
| CI/CD | PR/推送 | 测试、构建、部署 |
| 代码质量 | PR/推送 | Lint、格式化、类型检查 |
| 安全扫描 | 定时/推送 | 漏洞扫描、依赖检查 |
| 欢迎消息 | Issue/PR | 自动欢迎新贡献者 |
| 周报生成 | 每周一 | 生成项目统计 |
| 贡献者认可 | PR合并 | 奖励积分、发放徽章 |

---

**通过这些自动化工作流，我们可以：**
- ✅ 保证代码质量
- ✅ 加快审查流程
- ✅ 提升开发者体验
- ✅ 追踪项目进度
- ✅ 认可贡献者贡献

**智枢为民，众生平等；AI为公，永不异化。**
