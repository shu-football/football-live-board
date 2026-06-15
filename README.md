# 足球赛事实时积分榜

上海大学足球协会赛事管理平台。支持多赛季管理、小组赛积分榜、射手榜、红黄牌榜、淘汰赛对阵图、球员库管理、公告自动解析、数据备份恢复，以及线上抽签。

> **代码仓库**: https://github.com/shu-football/football-live-board  
> **线上地址**: （Netlify 部署后填入）  
> **备份访问**: 直接双击 `index.html` 在浏览器中打开（本地模式）

## 功能概览

| 模块 | 说明 |
|------|------|
| 赛季切换 | 多赛季数据隔离，一键切换年份 |
| 球员库 | 批量导入报名表（Excel/粘贴），管理姓名+号码+球队 |
| 积分榜 | A/B 组各队实时排名，自动均分球队、生成单循环赛程 |
| 淘汰赛对阵图 | 8进4 → 半决赛 → 决赛/季军赛，实时推演晋级 |
| 射手榜 | 按进球数排序，选球队后从球员库下拉选取 |
| 红黄牌榜 | 记录黄牌/红牌数量，选球队后从球员库下拉选取 |
| 公告解析 | 粘贴赛事公告文本，一键提取比分、进球队员、红黄牌 |
| 数据备份 | 导出/导入 JSON，支持云端同步 |
| 线上抽签 | 独立页面，输入球队名随机抽取落位，带动画效果 |

## 快速开始

### 方式一：纯本地预览（无需任何配置）

直接在浏览器中打开 `index.html` 即可。

- 默认使用本地 localStorage 存储
- 所有数据保存在浏览器本地
- **默认开启编辑模式**（方便离线录入）

### 方式二：启用 Supabase 云端（推荐）

需要数据多人共享或公开访问时使用。

#### 1. 创建 Supabase 项目

前往 [supabase.com](https://supabase.com) 创建免费项目。

#### 2. 执行建表 SQL

在 Supabase SQL Editor 中执行 `supabase-schema.sql`（复制全部内容粘贴执行）。

#### 3. 初始化管理员账号

在 `supabase-schema.sql` 底部已有默认 owner 配置：

```sql
insert into public.admin_users(email, role, is_active)
values ('w2564139064@163.com', 'owner', true)
on conflict (email) do update set role = excluded.role, is_active = excluded.is_active;
```

如需使用其他邮箱，请先在 Supabase `Authentication -> Users` 中创建账号，再修改 SQL 中的邮箱地址后执行。

#### 4. 配置前端连接

打开 `app.js`，填写以下配置：

```javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const ADMIN_EMAILS = ["your@email.com"]; // 本地模式 fallback
```

配置完成后刷新页面即可：
- 所有人可匿名浏览（只读）
- 管理员登录后可编辑所有数据
- 数据实时同步到云端

### 方式三：部署到互联网（GitHub + Netlify 自动部署 ✅ 推荐）

项目已托管在 GitHub，push 代码后 Netlify 自动部署。

#### 初次设置

1. 将项目推送到 GitHub 仓库
2. 在 [Netlify](https://app.netlify.com) 用 GitHub 账号登录
3. **Add new site → Import an existing project** → 选 GitHub 仓库
4. 不用改任何设置，直接点 Deploy
5. 之后每次 `git push` 到 main 分支，Netlify 自动更新

#### 日常更新

```bash
git add -A
git commit -m "描述改动"
git push
# 等 1-2 分钟，网站自动更新
```

#### Netlify Drop（备选，无需 Git）

1. 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
2. 将整个项目文件夹拖入页面
3. 获得一个公开 URL

## 新赛季搭建流程

1. 在赛季切换器中添加新年份
2. 导入球员报名表（Excel 拖拽或粘贴文本）
3. 输入最终参赛球队名称
4. 系统自动均分 A/B 组（奇数时 A 组多一队）
5. 系统自动生成单循环小组赛赛程
6. 如需公开抽签，打开 `draw.html` 进行线上抽签

## 管理员使用指南

### 登录管理员账号

1. 页面顶部点击"管理员入口"展开登录表单
2. 输入邮箱 + 密码登录
3. 登录成功后页面显示"管理员模式 (your@email.com)"徽章

### 修改密码

在管理员入口的"密码管理"区块，输入新密码（至少6位）后提交。

### 重置密码（通过邮件）

如需让其他管理员重置密码，在"重置密码邮箱"输入对方邮箱，提交后对方会收到 Supabase 发送的重置邮件。

### 添加新管理员

1. 以 owner 账号登录
2. 在"管理员管理"区块输入新管理员邮箱
3. 点击"添加管理员"即可

新管理员需在 Supabase `Authentication -> Users` 中提前创建账号（设置初始密码），或在添加后通过"忘记密码"自行重置。

### 禁用/恢复管理员

在"管理员管理"表格中点击"禁用/启用"。注意不能禁用自己。

## 数据管理

### 球员库管理

在"球员库"区块：
- **批量导入**：拖拽 Excel 文件（.xlsx/.xls）或粘贴表格文本，自动解析姓名+号码+球队
- **手动添加**：逐条录入球员信息
- 球员库按赛季隔离，切换赛季后自动切换对应数据

### 录入射手/红黄牌

1. 先在下拉框选择球队
2. 球员姓名下拉框自动过滤为该队球员
3. 选择球员，填入进球数或牌类型即可

无需手动打字，避免拼写错误。

### 手动录入比赛比分

在"比赛赛果"区块，找到对应场次，输入主队和客队得分后点击"保存"。

### 自动解析公告

1. 将赛事公告全文粘贴到"公告自动解析"文本框
2. 点击"解析并覆盖更新"
3. 系统自动提取：比分、进球队员、红黄牌

> 若需对同一公告重新解析，请勾选"强制重新解析"。

### 淘汰赛比分录入

在"淘汰赛比分录入"区块输入各场次比分。如有点球大战，额外填写点球得分。

### 数据备份与恢复

- **导出备份**：点击"导出备份 JSON"下载完整数据文件
- **恢复备份**：选择备份 JSON 文件后自动恢复
- **从云端重读**：点击"从云端重新读取"同步云端最新数据

## 当前权限逻辑

- **前端**：不强制登录，观众直接可浏览
- **后端**：Supabase RLS 策略控制，仅 admin_users 表中的活跃管理员可写
- **本地模式**：默认开启编辑，方便离线使用

## 目录结构

```
football-live-board/
├── index.html          # 主页面（积分榜/射手榜/赛程/淘汰赛）
├── draw.html           # 线上抽签页面
├── styles.css          # 样式表
├── app.js              # 核心逻辑（数据、渲染、事件绑定）
├── draw.js             # 抽签逻辑
├── supabase-schema.sql # Supabase 数据库建表脚本
├── ADMIN_GUIDE.md      # 管理员操作手册（详细）
├── README.md           # 本文档
├── .gitignore          # Git 忽略规则
└── assets/
    └── sufa-logo.png   # 上海大学足球协会 Logo
```

## 小组赛与淘汰赛规则

- 球队等分两组（奇数时 A 组多一队）
- 单循环赛制，每队与同组其他队伍各赛一场
- A/B 组各前四名晋级淘汰赛
- 淘汰赛对阵：
  - 左半区：A1 vs B4、A3 vs B2
  - 右半区：B1 vs A4、B3 vs A2