#!/bin/bash
# Hermes Agent 自我学习脚本
# 每日定时运行，从历史数据中学习

set -e

echo "🤖 启动 Hermes 自我学习流程"
echo "时间: $(date)"

# 1. 收集今日数据
echo "📊 收集今日数据..."
python3 -c "
from website.backend.memory_store import get_memory_store
store = get_memory_store()

# 统计今日学习成果
stats = store.get_recent_learning_stats(days=1)
print('今日学习统计:', stats)

# 获取常用模式
patterns = store.get_common_patterns(limit=5)
print('常用模式:', patterns)
"

# 2. 分析PR和Issue趋势
echo "📈 分析趋势..."
python3 -c "
from website.backend.memory_store import get_memory_store
store = get_memory_store()

# 7天统计
week_stats = store.get_recent_learning_stats(days=7)
print('本周统计:', week_stats)

# 技能统计
skill_stats = store.get_skill_stats()
print('技能统计:', skill_stats)
"

# 3. 生成学习报告
echo "📝 生成学习报告..."
REPORT_FILE="/tmp/hermes_learning_$(date +%Y%m%d).json"

cat > $REPORT_FILE << 'EOF'
{
  "report_date": "DATE_PLACEHOLDER",
  "learning_status": "active",
  "next_actions": [
    "optimize_review_workflow",
    "improve_response_templates",
    "update_skill_priorities"
  ]
}
EOF

sed -i "s/DATE_PLACEHOLDER/$(date -Iseconds)/" $REPORT_FILE

echo "✅ 学习流程完成"
echo "报告: $REPORT_FILE"

# 4. 推送学习成果 (如果有git remote)
if git remote get-url origin > /dev/null 2>&1; then
    echo "🔄 同步学习数据..."
    # git add -A
    # git commit -m "🤖 Auto: 学习数据更新 $(date)"
    # git push origin main 2>/dev/null || echo "无需推送"
fi

echo "🎯 自我学习流程结束"
