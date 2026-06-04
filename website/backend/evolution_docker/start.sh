#!/bin/bash
# 自进化引擎 Docker 启动脚本

set -e

echo "================================================"
echo "  众生智枢 · 自进化引擎 Docker 部署"
echo "================================================"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

# 获取脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EVOLUTION_DIR="$SCRIPT_DIR"

cd "$EVOLUTION_DIR"

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "创建环境变量文件..."
    cat > .env << 'EOF'
# GitHub Token (可选，用于收集GitHub数据)
GITHUB_TOKEN=

# 时区
TZ=Asia/Shanghai
EOF
    echo "⚠️ 请编辑 .env 文件设置 GITHUB_TOKEN (可选)"
fi

# 启动服务
echo ""
echo "启动自进化引擎..."
echo ""

docker-compose up -d

echo ""
echo "================================================"
echo "  自进化引擎已启动!"
echo "================================================"
echo ""
echo "服务地址:"
echo "  - 自进化引擎: http://localhost:8001"
echo "  - 主后端: http://localhost:8000"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
echo ""
