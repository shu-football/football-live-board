# CLAUDE.md — 足球赛事实时积分板

上海大学足球协会赛事管理平台。纯前端单页应用（无框架）。

## 每次项目更新后必须更新本文件
- 任何功能增删、架构调整、配置变更完成后，同步更新 CLAUDE.md 保持准确

## 部署与协作

- **代码仓库**: https://github.com/shu-football/football-live-board
- **托管平台**: Netlify（通过 GitHub 自动部署）
- **数据库**: Supabase（项目归属个人账号，通过 Team 功能添加协作者）
- **部署流程**: 代码 push 到 GitHub main 分支 → Netlify 自动检测 → 自动上线
- **Supabase**: 当前在王恩祈个人账号下，可邀请协作者（Settings → Team）或未来迁移到足协公用 Supabase 账号

## 项目结构

```
D:\football-live-board\
├── index.html          # 主页面 (赛季选择/积分榜/射手榜/红黄牌/淘汰赛/球员库/赛季配置/赛果录入/公告解析/媒体画廊)
├── app.js              # 核心逻辑 状态管理/渲染/Cloud同步/事件
├── styles.css          # 所有样式 (含 ko-winner 蓝色高亮、bracket 三列布局、媒体画廊、响应式)
├── schedule-utils.js   # 赛程生成: splitGroups, generateRoundRobin, generateKnockoutBracket
├── player-pool.js      # 球员库: CRUD, Excel解析, 粘贴解析
├── draw.html           # 线上抽签(独立页面,不联动主应用)
├── draw.js             # 抽签逻辑: 动画滚动 → 逐位揭晓 → 结果复制
├── draw.css            # 抽签样式: 卡位动画、脉冲/揭晓关键帧
├── supabase-schema.sql # 数据库建表脚本 (含 RLS、is_admin/is_owner/is_media_editor 函数)
├── ADMIN_GUIDE.md      # 管理员手册
├── README.md           # 项目说明
├── .cursor_context.md  # Cursor 上下文摘要 (技术决策/已知问题/待办)
├── .gitignore          # Git 忽略规则
└── assets/sufa-logo.png
```

## 关键架构

- `state` 持有当前赛季所有数据，包括 `cardRules: { yellowThreshold: 2 }`
- card 模型: `{ id, player, team, yellow, red, suspended }` — `suspended` 字段追踪是否正处于黄牌累计停赛
- matchMedia 模型: `{ id, season, media_date, media_type, storage_path, public_url, description }` — 云端存 Supabase Storage，本地模式用 Data URL
- localStorage key: `football_live_board_state_v4_{season}`
- 赛季列表: `football_live_board_seasons` (JSON数组)
- Cloud: Supabase，所有数据表有 `season` 字段过滤
- 渲染模式: 事件 → 修改 state → `persistChanges()` (saveLocal + saveCloudAll + renderAll)
- 加载顺序: html2canvas CDN → xlsx CDN → supabase CDN → schedule-utils.js → player-pool.js → app.js
- 球员输入: `<datalist>` 联动，选队后过滤球员建议
- 抽签页面完全独立，不与主应用联动

## 主要功能

- **赛季管理**: 添加/切换/删除赛季，数据按赛季完全隔离
- **赛季配置**: A/B 组球队两栏分开手动输入，生成单循环赛程和淘汰赛对阵
- **积分榜**: A/B 组实时排名，导出为 PNG (html2canvas)
- **射手榜/红黄牌**: 球员库 datalist 联想；停赛追踪（2027+）；红牌自动停赛标记；射手榜导出为 PNG
- **球员库**: Excel 拖拽/粘贴/手动添加；未登录时隐藏
- **淘汰赛**: 8 场固定对阵，排名自动填入，导出为 PNG。胜者队伍名自动标蓝（`.ko-winner` class）。种子标签（如"QF1胜"）在晋级队伍确定后自动更新为队名。卡片状态：两队就绪未开赛 → 蓝左边框（`.ko-ready`），已结束 → 半透明（`.ko-done`）。前序比赛就绪但无结果时队伍名显示"待定"。
- **赛果简报**: 选日期一键生成比分+射手+红黄牌文本，复制到剪贴板
- **公告解析**: 粘贴公告自动提取比分/进球/红黄牌
- **数据备份**: JSON 导出/导入，云端同步
- **媒体画廊**: 按日期上传/展示比赛图片和宣传视频，灯箱预览，按日期筛选
- **角色权限**: owner / admin / media_editor 三级，media_editor 仅可上传和删除媒体

## 角色权限

| 权限 | owner | admin | media_editor |
|------|-------|-------|-------------|
| 管理管理员 | ✅ | ❌ | ❌ |
| 录入比分/射手/红黄牌 | ✅ | ✅ | ❌ |
| 球员库/赛季配置 | ✅ | ✅ | ❌ |
| 上传图片/视频 | ✅ | ✅ | ✅ |
| 删除媒体 | ✅ | ✅ | ✅ |
| 公告解析 | ✅ | ✅ | ❌ |

- `mustAdmin()`: 仅 owner/admin 通过，用于比分/射手/红黄牌/球员库/赛季配置等数据操作
- `mustMediaEditor()`: owner/admin/media_editor 均通过，仅用于媒体上传和删除
- `updateModeUI()`: `.admin-only` 仅 owner/admin 可见；`.media-editor-only` 所有角色可见

## 协作者更新网站流程

### 初次设置（新协作者只需做一次）

```bash
# 1. 装 Git: https://git-scm.com/download/win
# 2. 克隆仓库到本地
git clone https://github.com/shu-football/football-live-board.git
cd football-live-board
```

### 日常更新流程

```
改代码 → git add/commit → git push → Netlify 自动部署（约1分钟生效）
```

```bash
git add -A
git commit -m "描述你改了什么"
git push
```

### SUPABASE 管理

当前 Supabase 项目在王恩祈个人账号下。有两种方式给别人权限：

**方式 A — 添加团队成员（推荐，两者都做）**
1. 打开 [supabase.com/dashboard](https://supabase.com/dashboard)，进项目
2. Settings → Team → 输入对方邮箱 → 发送邀请
3. 对方接受后即可管理数据库、查看 Authentication 用户

**方式 B — 迁移到足协公用 Supabase 账号**
1. 用足协邮箱注册新的 Supabase 账号
2. 在 SQL Editor 中执行 `supabase-schema.sql` 建表
3. 在 Authentication 中创建管理员用户
4. 把 `app.js` 里的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 换成新项目的值

### NETLIFY 管理

Netlify 用 shu-football GitHub 账号登录，支持添加协作者：
1. Site settings → Members → 添加 Collaborator
2. Collaborator 可部署但不可删除站点

### 各账号说明

| 服务 | 账号 | 说明 |
|------|------|------|
| GitHub | shu-football | 存代码，push 触发自动部署 |
| Netlify | 绑 GitHub shu-football | 静态托管，自动从 GitHub 部署 |
| Supabase | 王恩祈个人账号 | 数据库+认证，通过 Team 加协作者 |
| 网站 owner | w2564139064@163.com | 网站最高管理员 |

## 媒体画廊实现

- Supabase Storage bucket: `match-media`（公开）
- 数据库表: `public.match_media`（RLS: `is_media_editor()` 可写，全员可读）
- 本地模式: 文件转 Data URL 存入 localStorage
- 云端模式: 文件上传到 Storage → 公开 URL + 元数据写入 match_media 表
- 图片限制 20MB，视频限制 200MB
- 画廊默认显示当天日期，可切换日期筛选

## 赛季差异

| 功能 | 2026 赛季 | 2027+ 赛季 |
|------|----------|-----------|
| 红黄牌"总计"列 | 黄+红数字和 | 停赛状态文字（带颜色） |
| 黄牌阈值配置 | 隐藏 | 可见可调 |
| 清零黄牌按钮 | 隐藏 | 可见 |
| 自动停赛标记 | 禁用 | 启用 |
| 录入比分自动清除停赛 | 禁用 | 启用 |
| match ID 格式 | "A-R1-1" | "{season}-A-R1-1" |
| 淘汰赛 ID | "QF1" | "{season}-QF1" |

## 注意事项

- 小组赛: circle method 单循环 (schedule-utils.js)
- 淘汰赛: QF1-4, SF1-2, Third, Final 固定对阵
- 分组由用户手动输入，线下抽签结果直接填入
- 淘汰赛 `homeFrom` 用 `lastIndexOf("-")` 解析（因 ID 含连字符）
- 淘汰赛渲染：每组对阵卡片有两个 `ko-team-row`（home/away），必须分别调用 `applyWinner(rowId, "home", match)` 和 `applyWinner(rowId, "away", match)` 才能保证两侧胜者都标蓝
- `renderKnockout` 内 `teamFallback(fromRef)`: 前序比赛就绪但无比分/点球时返回"待定"，其余返回"—"
- `renderKnockout` 内 `setCardState(cardSelector, match, teams)`: 无比分且两队已知 → `.ko-ready`；有比分 → `.ko-done`
- QF/SF/Third/Final 四轮卡片均需调用 `setCardState`；SF/Third/Final 的种子标签需在 `getKnockoutMatchTeams` 返回后更新
- 删除赛季只清 localStorage，不删 Supabase 数据
- `exportStandingsImage()` / `exportKnockoutImage()`: 构建离屏 DOM → html2canvas → 下载 PNG
- `clearSuspensionsForTeams(homeTeam, awayTeam)`: 录入比分后自动清除本场两队已停赛球员标记
- 黄牌清零: 半决赛前，`yellow < threshold` 的清零，`>= threshold` 的保留
- `generateMatchSummary(dateStr)`: 按日期筛选已完赛比赛，拼接比分+射手榜+红黄牌文本
- `uploadMatchMedia(file, mediaDate, description)`: 云端上传到 Storage → 写入 match_media 表；本地用 FileReader Data URL
- `deleteMatchMedia(mediaId)`: 云端同时删除 Storage 文件 + DB 记录；本地从 state 移除
- `loadMatchMediaCloud()`: 在 `loadCloudData()` 末尾调用，从 match_media 表加载当前赛季媒体
