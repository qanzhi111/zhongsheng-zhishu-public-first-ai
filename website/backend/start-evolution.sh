#!/bin/bash
# ============================================================
# 众生智枢 · 自进化引擎启动脚本
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/website/backend"

echo "================================================"
echo "  众生智枢 · 自进化引擎"
echo "  ZhongSheng ZhiShu - Self-Evolution Engine"
echo "================================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Python
check_python() {
    echo -e "${BLUE}检查Python环境...${NC}"

    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3 未安装${NC}"
        exit 1
    fi

    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo -e "${GREEN}✅ Python $PYTHON_VERSION${NC}"
}

# 检查依赖
check_dependencies() {
    echo ""
    echo -e "${BLUE}检查依赖...${NC}"

    cd "$BACKEND_DIR"

    # 检查pip
    if ! command -v pip3 &> /dev/null; then
        echo -e "${RED}❌ pip3 未安装${NC}"
        exit 1
    fi

    # 安装依赖
    echo "安装Python依赖..."
    pip3 install --quiet schedule

    echo -e "${GREEN}✅ 依赖检查完成${NC}"
}

# 初始化数据库
init_database() {
    echo ""
    echo -e "${BLUE}初始化数据库...${NC}"

    cd "$BACKEND_DIR"

    python3 << 'EOF'
import sys
sys.path.insert(0, '.')

from evolution_engine import get_evolution_engine
from github_collector import get_github_collector

# 初始化进化引擎数据库
engine = get_evolution_engine()
print("✅ 进化引擎数据库已初始化")

# 初始化GitHub收集器数据库
collector = get_github_collector()
print("✅ GitHub收集器数据库已初始化")

print("✅ 数据库初始化完成")
EOF

    echo -e "${GREEN}✅ 数据库初始化完成${NC}"
}

# 启动模式选择
select_mode() {
    echo ""
    echo "请选择启动模式:"
    echo ""
    echo "1) 🚀 持续运行模式 (推荐)"
    echo "   - 自进化引擎持续后台运行"
    echo "   - 每日自动执行学习任务"
    echo ""
    echo "2) ⚡ 单次运行模式"
    echo "   - 执行一次所有学习任务"
    echo "   - 立即输出结果"
    echo ""
    echo "3) 📊 状态查看模式"
    echo "   - 查看自进化系统状态"
    echo "   - 查看学习统计"
    echo ""
    echo "4) 🔧 调试模式"
    echo "   - 运行特定任务进行调试"
    echo ""

    read -p "请选择 [1-4]: " mode

    case $mode in
        1)
            start_continuous
            ;;
        2)
            start_once
            ;;
        3)
            show_status
            ;;
        4)
            debug_mode
            ;;
        *)
            echo "无效选择，默认选择持续运行"
            start_continuous
            ;;
    esac
}

# 持续运行模式
start_continuous() {
    echo ""
    echo -e "${GREEN}🚀 启动持续运行模式...${NC}"
    echo ""
    echo "调度任务:"
    echo "  02:00 - 每日学习"
    echo "  03:00 - 模式分析"
    echo "  04:00 - 知识精炼"
    echo "  05:00 - 统计更新"
    echo "  06:00 - 数据清理"
    echo ""
    echo "按 Ctrl+C 停止"
    echo ""

    cd "$BACKEND_DIR"

    # 设置环境变量
    export PYTHONPATH="$BACKEND_DIR:$PYTHONPATH"

    # 启动调度器
    python3 evolution_scheduler.py
}

# 单次运行模式
start_once() {
    echo ""
    echo -e "${YELLOW}⚡ 执行单次运行...${NC}"
    echo ""

    cd "$BACKEND_DIR"

    python3 << 'EOF'
import sys
sys.path.insert(0, '.')

from evolution_engine import get_evolution_engine
from github_collector import get_github_collector
from evolution_scheduler import EvolutionScheduler
from datetime import datetime

print(f"开始时间: {datetime.now().isoformat()}")
print("=" * 50)

# 创建调度器并运行所有任务
scheduler = EvolutionScheduler()

tasks = [
    "daily_learning",
    "pattern_analysis", 
    "knowledge_refinement",
    "stats_update",
    "cleanup"
]

for task in tasks:
    print(f"\n执行任务: {task}")
    scheduler.trigger_task(task)

print("\n" + "=" * 50)
print(f"完成时间: {datetime.now().isoformat()}")

# 显示统计
print("\n📊 学习统计:")
from evolution_engine import get_evolution_engine
engine = get_evolution_engine()
trends = engine.get_trending_topics(days=7)
print(f"  发现 {len(trends)} 个热门模式")
EOF
}

# 状态查看
show_status() {
    echo ""
    echo -e "${BLUE}📊 查看状态...${NC}"
    echo ""

    cd "$BACKEND_DIR"

    python3 << 'EOF'
import sys
sys.path.insert(0, '.')

from evolution_engine import get_evolution_engine
from github_collector import get_github_collector
from evolution_scheduler import EvolutionScheduler

print("=" * 50)
print("  众生智枢 · 自进化系统状态")
print("=" * 50)

# 调度器状态
scheduler = EvolutionScheduler()
status = scheduler.get_status()

print(f"\n调度器状态: {'运行中' if status['running'] else '已停止'}")
print(f"\n已调度任务:")
for task in status['scheduled_tasks']:
    print(f"  - {task['task']}: {task['next_run']}")

# 学习统计
print("\n📈 学习统计:")
data = collector.get_learning_data(days=7)
print(f"  PR处理: {data['pr_stats']['total']} (合并: {data['pr_stats']['merged']})")
print(f"  Issue处理: {data['issue_stats']['total']} (关闭: {data['issue_stats']['closed']})")

# 热门模式
engine = get_evolution_engine()
trends = engine.get_trending_topics(days=7)
print(f"\n🔥 热门模式 (本周):")
for trend in trends[:5]:
    print(f"  - {trend['pattern']}: {trend['occurrences']}次 (有效性: {trend['avg_effectiveness']})")

print("\n" + "=" * 50)
EOF
}

# 调试模式
debug_mode() {
    echo ""
    echo -e "${YELLOW}🔧 调试模式${NC}"
    echo ""
    echo "可用任务:"
    echo "  1) daily_learning - 每日学习"
    echo "  2) pattern_analysis - 模式分析"
    echo "  3) knowledge_refinement - 知识精炼"
    echo "  4) stats_update - 统计更新"
    echo "  5) cleanup - 数据清理"
    echo ""

    read -p "选择任务 [1-5]: " task_num

    tasks=("daily_learning" "pattern_analysis" "knowledge_refinement" "stats_update" "cleanup")
    task=${tasks[$((task_num-1))]}

    if [ -n "$task" ]; then
        cd "$BACKEND_DIR"
        export PYTHONPATH="$BACKEND_DIR:$PYTHONPATH"
        python3 -c "
import sys
sys.path.insert(0, '.')
from evolution_scheduler import EvolutionScheduler
scheduler = EvolutionScheduler()
scheduler.trigger_task('$task')
"
    fi
}

# 主流程
main() {
    check_python
    check_dependencies
    init_database
    select_mode
}

main "$@"
