# CI/CD 调试技能
# 用于分析和解决CI/CD问题

## 使用场景
当CI/CD流水线失败或需要调试时使用此技能。

## 常见错误处理

### 1. 前端构建失败

#### TypeScript 错误
```
检查:
1. 类型定义是否正确
2. 导入路径是否正确
3. 类型转换是否正确
4. 第三方库类型是否存在

解决方案:
- 运行: npx tsc --noEmit 查看具体错误
- 安装缺失类型: npm install @types/xxx
- 检查 tsconfig.json 配置
```

#### ESLint 错误
```
检查:
1. 代码是否符合规范
2. 是否使用了未声明的变量
3. 导入是否正确

解决方案:
- 查看错误信息中的具体行号
- 运行: npm run lint 查看所有错误
- 自动修复: npm run lint -- --fix
```

#### 构建产物问题
```
检查:
1. 构建是否完成
2. 资源路径是否正确
3. 环境变量是否配置

解决方案:
- 清除缓存: rm -rf node_modules/.cache
- 重新构建: npm run build
- 检查 vite.config.ts 配置
```

### 2. 后端构建失败

#### TypeScript 错误
```
检查:
1. 目标目录: dist
2. 模块类型: commonjs vs esnext
3. 类型检查是否严格

解决方案:
- 查看 tsc 输出
- 检查 tsconfig.json
```

#### 测试失败
```
检查:
1. 测试用例是否正确
2. Mock是否正确
3. 异步处理是否正确

解决方案:
- 查看测试输出
- 运行单个测试: npm test -- --testNamePattern="xxx"
```

### 3. Docker 构建失败

```
检查:
1. Dockerfile 语法
2. 基础镜像是否可用
3. 依赖安装是否成功

常见问题:
- node_modules 问题: 删除并重新创建
- 端口冲突: 检查端口映射
- 环境变量: 检查 .env 配置
```

## 调试命令

### 本地重现CI环境
```bash
# 前端
docker run -v $(pwd):/app -w /app node:18 npm ci
npm run lint
npm run build

# 后端
docker run -v $(pwd):/app -w /app node:18 npm ci
npm run build
npm test
```

### 查看详细日志
```bash
# GitHub Actions
# 在workflow中添加
- run: npm ci
  env:
    CI: true

# 查看Actions日志
gh run view --log
```

## 自动化修复建议

### 当检测到常见错误时:
1. package-lock.json 冲突 -> 建议删除并重新生成
2. 缓存问题 -> 建议清除缓存
3. 依赖问题 -> 建议更新依赖

### 升级策略
```
Minor版本依赖: 自动合并
Patch版本: 自动合并
Major版本: 需要审查
```

## 响应模板

### CI失败通知
```
⚠️ **CI/CD 构建失败**

**问题类型:** ${type}
**Job:** ${job_name}
**分支:** ${branch}

**错误摘要:**
\`\`\`
${error_summary}
\`\`\`

**建议排查:**
1. 查看完整日志
2. 本地重现问题
3. 修复后重新提交

**常用修复命令:**
\`\`\`bash
# 清除缓存
rm -rf node_modules/.cache

# 重新安装
rm -rf node_modules package-lock.json
npm ci

# 类型检查
npx tsc --noEmit
\`\`\`

---
*🔧 众生智枢CI助手*
```
