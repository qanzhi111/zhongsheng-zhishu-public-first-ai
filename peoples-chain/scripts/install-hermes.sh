#!/bin/bash
# Hermes Agent 快速安装脚本
# 用于众生智枢项目

set -e

echo "🤖 Hermes Agent 安装向导"
echo "================================"

# 检查前置条件
check_dependencies() {
    echo "📋 检查前置条件..."

    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装"
        echo "   macOS: brew install git"
        echo "   Ubuntu/Debian: sudo apt install git"
        exit 1
    fi

    if ! command -v curl &> /dev/null; then
        echo "❌ Curl 未安装"
        exit 1
    fi

    echo "✅ 前置条件检查通过"
}

# 选择安装方式
choose_install_method() {
    echo ""
    echo "请选择安装方式:"
    echo "1) 本地安装 (开源免费，需要API密钥)"
    echo "2) FlyHermes云服务 (托管版本，更快上手)"
    echo ""
    read -p "请选择 [1/2]: " choice

    case $choice in
        1)
            install_local
            ;;
        2)
            install_flyhermes
            ;;
        *)
            echo "无效选择，默认选择本地安装"
            install_local
            ;;
    esac
}

# 本地安装
install_local() {
    echo ""
    echo "📦 开始本地安装 Hermes Agent..."

    # 运行官方安装脚本
    curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

    # 重新加载shell配置
    echo ""
    echo "🔄 重新加载shell配置..."
    if [ -f "$HOME/.zshrc" ]; then
        source ~/.zshrc
    elif [ -f "$HOME/.bashrc" ]; then
        source ~/.bashrc
    fi

    # 验证安装
    if command -v hermes &> /dev/null; then
        echo "✅ Hermes 安装成功!"
        hermes --version
    else
        echo "⚠️ 请重新打开终端或运行: source ~/.zshrc"
    fi

    # 配置
    echo ""
    echo "⚙️ 开始配置..."
    configure_hermes
}

# FlyHermes云服务
install_flyhermes() {
    echo ""
    echo "☁️ 跳转到 FlyHermes 注册..."
    echo "   https://flyhermes.ai"
    echo ""
    echo "FlyHermes 提供:"
    echo "  - 无需维护VPS"
    echo "  - API成本包含"
    echo "  - 技能库访问"
    echo "  - 取消随时"
}

# 配置Hermes
configure_hermes() {
    echo ""
    echo "⚙️ 配置 Hermes Agent..."

    # 创建项目配置目录
    mkdir -p ~/.hermes/projects/zhongsheng

    # 复制项目配置
    if [ -d "$(pwd)/peoples-chain/hermes" ]; then
        cp -r "$(pwd)/peoples-chain/hermes/"* ~/.hermes/projects/zhongsheng/
        echo "✅ 项目配置已复制"
    fi

    # 设置API密钥
    echo ""
    echo "🔑 配置模型提供商..."
    echo "支持的提供商:"
    echo "1) OpenAI (GPT-4)"
    echo "2) Anthropic (Claude)"
    echo "3) Nous Portal (免费额度)"
    echo "4) OpenRouter"
    echo "5) 本地模型 (Ollama)"
    echo ""

    read -p "请选择 [1-5]: " provider_choice

    case $provider_choice in
        1) provider="openai";;
        2) provider="anthropic";;
        3) provider="nous";;
        4) provider="openrouter";;
        5) provider="ollama";;
        *) provider="openai";;
    esac

    # 创建环境配置
    cat > ~/.hermes/projects/zhongsheng/.env << EOF
# 众生智枢 Hermes 配置
HERMES_PROVIDER=$provider
HERMES_MODEL=gpt-4

# 如果使用云服务，添加API密钥
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
EOF

    echo "✅ 配置已保存到 ~/.hermes/projects/zhongsheng/.env"
    echo ""
    echo "⚠️ 请编辑 .env 文件添加您的API密钥"
}

# 验证安装
verify_installation() {
    echo ""
    echo "🔍 验证安装..."
    if command -v hermes &> /dev/null; then
        echo "✅ Hermes 命令可用"
        hermes doctor || echo "⚠️ 运行 hermes doctor 检查配置"
    else
        echo "❌ Hermes 未正确安装"
    fi
}

# 运行测试
run_smoke_test() {
    echo ""
    echo "🧪 运行烟雾测试..."
    echo "输入 'quit' 退出"
    echo ""

    if command -v hermes &> /dev/null; then
        hermes chat -q "回复'智枢为民，众生平等'确认系统正常"
    else
        echo "⚠️ Hermes 不可用，跳过测试"
    fi
}

# 显示完成信息
show_completion() {
    echo ""
    echo "================================"
    echo "🎉 Hermes 安装完成!"
    echo "================================"
    echo ""
    echo "下一步:"
    echo "1. 编辑 ~/.hermes/projects/zhongsheng/.env 添加API密钥"
    echo "2. 运行 'hermes setup' 配置模型"
    echo "3. 运行 'hermes chat' 开始对话"
    echo "4. 运行 'hermes doctor' 检查健康状态"
    echo ""
    echo "项目配置: ~/.hermes/projects/zhongsheng/"
    echo ""
    echo "智枢为民，众生平等；AI为公，永不异化。🙏"
}

# 主流程
main() {
    check_dependencies
    choose_install_method
    verify_installation
    run_smoke_test
    show_completion
}

main "$@"
