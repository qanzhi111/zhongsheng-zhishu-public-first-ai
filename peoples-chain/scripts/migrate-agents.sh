#!/bin/bash
# Hermes ↔ OpenClaw 互迁移脚本
# 将配置和记忆从一个平台迁移到另一个

set -e

echo "🔄 Hermes ↔ OpenClaw 迁移工具"
echo "================================"

# 迁移方向
echo "请选择迁移方向:"
echo "1) OpenClaw → Hermes (推荐)"
echo "2) Hermes → OpenClaw"
echo "3) 同步两边配置"
read -p "请选择 [1-3]: " direction

case $direction in
    1)
        migrate_to_hermes
        ;;
    2)
        migrate_to_openclaw
        ;;
    3)
        sync_both
        ;;
    *)
        echo "无效选择，退出"
        exit 1
        ;;
esac

# OpenClaw → Hermes
migrate_to_hermes() {
    echo ""
    echo "📤 从 OpenClaw 迁移到 Hermes..."

    # 迁移记忆
    if [ -d "$HOME/.openclaw/memory" ]; then
        mkdir -p "$HOME/.hermes/memory"
        cp -r "$HOME/.openclaw/memory/"* "$HOME/.hermes/memory/" 2>/dev/null || true
        echo "✅ 记忆已迁移"
    fi

    # 迁移技能
    if [ -d "$HOME/.openclaw/skills" ]; then
        mkdir -p "$HOME/.hermes/skills"
        # 将Lua技能转换为Markdown格式
        for skill in "$HOME/.openclaw/skills/"*.lua; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill" .lua)
                # 简单的Lua到Markdown转换
                {
                    echo "# $name"
                    echo ""
                    echo "## 来源"
                    echo "从 OpenClaw 技能: $name.lua"
                    echo ""
                    echo "## 描述"
                    sed -n '/description\s*=/p' "$skill" | head -1
                    sed -n '/trigger\s*=/p' "$skill" | head -1
                } > "$HOME/.hermes/skills/${name}.md"
            fi
        done
        echo "✅ 技能已迁移 (Lua → Markdown)"
    fi

    # 迁移SOUL
    if [ -f "$HOME/.openclaw/soul.md" ]; then
        cp "$HOME/.openclaw/soul.md" "$HOME/.hermes/SOUL.md"
        echo "✅ SOUL 已迁移"
    fi

    echo ""
    echo "✅ 迁移完成!"
    echo "请运行 'hermes chat' 验证"
}

# Hermes → OpenClaw
migrate_to_openclaw() {
    echo ""
    echo "📤 从 Hermes 迁移到 OpenClaw..."

    # 迁移记忆
    if [ -d "$HOME/.hermes/memory" ]; then
        mkdir -p "$HOME/.openclaw/memory"
        cp -r "$HOME/.hermes/memory/"* "$HOME/.openclaw/memory/" 2>/dev/null || true
        echo "✅ 记忆已迁移"
    fi

    # 迁移技能
    if [ -d "$HOME/.hermes/skills" ]; then
        mkdir -p "$HOME/.openclaw/skills"
        # 将Markdown技能转换为Lua格式
        for skill in "$HOME/.hermes/skills/"*.md; do
            if [ -f "$skill" ]; then
                name=$(basename "$skill" .md)
                # 简单的Markdown到Lua转换
                {
                    echo "-- $name"
                    echo "-- 从 Hermes 技能迁移"
                    echo ""
                    echo "local skill = {"
                    echo "  name = \"$name\","
                    echo "  description = [["
                    cat "$skill"
                    echo "]],"
                    echo "  trigger = { \"general\" },"
                    echo "  actions = {}"
                    echo "}"
                    echo ""
                    echo "return skill"
                } > "$HOME/.openclaw/skills/${name}.lua"
            fi
        done
        echo "✅ 技能已迁移 (Markdown → Lua)"
    fi

    echo ""
    echo "✅ 迁移完成!"
}

# 同步两边
sync_both() {
    echo ""
    echo "🔄 同步 Hermes 和 OpenClaw..."

    # 创建共享记忆目录
    SHARED_MEMORY="$HOME/.ai-agent-shared/memory"
    mkdir -p "$SHARED_MEMORY"

    # 创建符号链接
    ln -sf "$SHARED_MEMORY" "$HOME/.hermes/memory/shared" 2>/dev/null || true
    ln -sf "$SHARED_MEMORY" "$HOME/.openclaw/memory/shared" 2>/dev/null || true

    echo "✅ 共享记忆目录已创建: $SHARED_MEMORY"
    echo ""
    echo "请手动同步以下文件:"
    echo "  - SOUL/identity 配置"
    echo "  - 技能文件"
}

echo ""
echo "================================"
echo "🎉 操作完成!"
echo "================================"
