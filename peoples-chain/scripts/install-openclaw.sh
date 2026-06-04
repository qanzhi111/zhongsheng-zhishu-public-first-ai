#!/bin/bash
# OpenClaw 安装脚本
# 用于众生智枢项目

set -e

echo "🦞 OpenClaw 安装向导"
echo "================================"

# 检查前置条件
check_dependencies() {
    echo "📋 检查前置条件..."

    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装 (需要 v18+)"
        echo "   macOS: brew install node"
        echo "   Ubuntu: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js 版本过低 (需要 v18+，当前 v${NODE_VERSION})"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi

    echo "✅ 前置条件检查通过 (Node.js $(node -v))"
}

# 安装OpenClaw
install_openclaw() {
    echo ""
    echo "📦 安装 OpenClaw..."

    # 克隆仓库
    if [ ! -d "openclaw" ]; then
        git clone https://github.com/openclaw-ai/openclaw.git
    fi

    cd openclaw

    # 安装依赖
    npm install

    echo "✅ OpenClaw 安装完成"
    cd ..
}

# 配置OpenClaw
configure_openclaw() {
    echo ""
    echo "⚙️ 配置 OpenClaw..."

    # 创建项目配置目录
    mkdir -p ~/.openclaw/projects/zhongsheng

    # 复制项目配置
    if [ -d "$(pwd)/peoples-chain/openclaw" ]; then
        cp -r "$(pwd)/peoples-chain/openclaw/"* ~/.openclaw/projects/zhongsheng/
        echo "✅ 项目配置已复制"
    fi

    # 配置GitHub App (可选)
    echo ""
    echo "🔗 GitHub 集成配置"
    echo "1) 使用 GitHub App (推荐)"
    echo "2) 使用 Personal Access Token"
    echo "3) 稍后配置"
    read -p "请选择 [1-3]: " gh_choice

    case $gh_choice in
        1)
            configure_github_app
            ;;
        2)
            configure_github_token
            ;;
        *)
            echo "跳过GitHub配置"
            ;;
    esac
}

# 配置GitHub App
configure_github_app() {
    echo ""
    echo "📱 GitHub App 配置"
    echo ""
    echo "请按照以下步骤操作:"
    echo "1. 访问 https://github.com/settings/apps/new"
    echo "2. 创建新的 GitHub App"
    echo "3. 设置以下权限:"
    echo "   - Repository permissions:"
    echo "     - Pull requests: Read & Write"
    echo "     - Issues: Read & Write"
    echo "     - Contents: Read"
    echo "     - Metadata: Read"
    echo "4. 生成私钥"
    echo ""
    read -p "App ID: " app_id
    read -p "私钥文件路径: " private_key_path

    cat > ~/.openclaw/projects/zhongsheng/.env << EOF
# 众生智枢 OpenClaw GitHub App 配置
GITHUB_APP_ID=$app_id
GITHUB_PRIVATE_KEY_PATH=$private_key_path
GITHUB_WEBHOOK_SECRET=your_webhook_secret
EOF

    echo "✅ GitHub App 配置已保存"
}

# 配置GitHub Token
configure_github_token() {
    echo ""
    echo "🔑 Personal Access Token 配置"
    echo ""
    echo "请创建 Personal Access Token:"
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 生成新令牌 (classic)"
    echo "3. 设置 repo 权限"
    echo ""
    read -p "Token: " github_token

    cat > ~/.openclaw/projects/zhongsheng/.env << EOF
# 众生智枢 OpenClaw 配置
GITHUB_TOKEN=$github_token
EOF

    echo "✅ Token 配置已保存"
}

# 配置消息平台
configure_platforms() {
    echo ""
    echo "💬 消息平台配置 (可选)"
    echo ""
    echo "支持的平台:"
    echo "1) Telegram"
    echo "2) Discord"
    echo "3) Slack"
    echo "4) 跳过"
    read -p "请选择 [1-4]: " platform_choice

    case $platform_choice in
        1)
            configure_telegram
            ;;
        2)
            configure_discord
            ;;
        3)
            configure_slack
            ;;
        *)
            echo "跳过消息平台配置"
            ;;
    esac
}

configure_telegram() {
    echo ""
    echo "📱 Telegram 配置"
    echo "1. @BotFather 创建机器人"
    echo "2. 获取 API Token"
    read -p "Telegram Bot Token: " tg_token

    cat >> ~/.openclaw/projects/zhongsheng/.env << EOF
TELEGRAM_BOT_TOKEN=$tg_token
EOF

    echo "✅ Telegram 配置已保存"
}

configure_discord() {
    echo ""
    echo "💬 Discord 配置"
    echo "1. Discord Developer Portal 创建应用"
    echo "2. 获取 Bot Token"
    read -p "Discord Bot Token: " dc_token

    cat >> ~/.openclaw/projects/zhongsheng/.env << EOF
DISCORD_BOT_TOKEN=$dc_token
EOF

    echo "✅ Discord 配置已保存"
}

configure_slack() {
    echo ""
    echo "💼 Slack 配置"
    echo "1. Slack API 创建应用"
    echo "2. 获取 Bot Token"
    read -p "Slack Bot Token: " slack_token

    cat >> ~/.openclaw/projects/zhongsheng/.env << EOF
SLACK_BOT_TOKEN=$slack_token
EOF

    echo "✅ Slack 配置已保存"
}

# 验证安装
verify_installation() {
    echo ""
    echo "🔍 验证安装..."
    cd openclaw
    if npm test &> /dev/null; then
        echo "✅ OpenClaw 安装验证通过"
    else
        echo "⚠️ OpenClaw 安装可能存在问题，请检查"
    fi
    cd ..
}

# 显示完成信息
show_completion() {
    echo ""
    echo "================================"
    echo "🎉 OpenClaw 安装完成!"
    echo "================================"
    echo ""
    echo "下一步:"
    echo "1. cd openclaw"
    echo "2. npm start"
    echo "3. 配置 webhook 指向你的服务器"
    echo ""
    echo "项目配置: ~/.openclaw/projects/zhongsheng/"
    echo ""
    echo "智枢为民，众生平等；AI为公，永不异化。🙏"
}

# 主流程
main() {
    check_dependencies
    install_openclaw
    configure_openclaw
    configure_platforms
    verify_installation
    show_completion
}

main "$@"
