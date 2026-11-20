# Absolute Portfolio

一个白底、极简、以「彩色文件夹」为主视觉的个人作品集网站。
单页静态站点 —— 无框架、无构建步骤、无外部 CDN 依赖，双击 `index.html` 即可打开。

## 结构

```
index.html      # 页面结构（Hero / 目录 / 关于 / 联系）
styles.css      # 全部样式（含自托管字体声明）
script.js       # 作品数据 + 筛选 / 弹窗 / 菜单逻辑
assets/
  hero-folders.png       # Hero 3D 文件夹主视觉
  fonts/                 # 自托管字体（Inter + 思源黑体子集，含中文）
```

## 如何改成你自己的

**1. 作品列表** — 打开 `script.js`，编辑顶部的 `PROJECTS` 数组：

```js
{ id:1, cat:"brand", catLabel:"品牌视觉", year:"2025",
  title:"项目名称", desc:"一句话介绍", g:"g1", tag:"BRAND IDENTITY" }
```

- `cat` 只能是 `brand` / `ops` / `aigc`（对应三个筛选分类）
- `year` 建议保留 2022–2025，否则顶部文件夹筛选会筛不到
- `g` 是卡片配色，可选 `g1`–`g9`；`tag` 显示在卡片左下角
- 想放真实作品图时：把 `.card-art` 里的 `.art-ring` / `.art-no` 去掉，给 `.card-art`
  加 `background-image:url("assets/xxx.jpg");background-size:cover`

**2. 名字与联系方式** — 在 `index.html` 里搜索并替换：

- `Designer Daishu` → 你的名字（出现在顶栏、Hero、页脚）
- `hello@example.com` → 你的邮箱
- `小红书号：4110341793` → 你的社交账号
- `<title>` 与 `<meta name="description">` → 用于分享与搜索

**3. 关于我** — 修改 `index.html` 中 `.about-body` 里的文案与 `.skills` 技能标签。

## 交互

| 操作 | 效果 |
| --- | --- |
| 点击 Hero 里任一文件夹 | 按对应年份筛选作品并滚动到目录 |
| 点击分类按钮 / 年份 | 组合筛选，右上角编号变为 `#年份` |
| 点击作品卡片 | 打开详情弹窗（Esc / 点击遮罩关闭） |
| 点击右上角 `+` | 展开导航菜单 |

## 部署

纯静态文件，直接托管即可：

- **GitHub Pages**：Settings → Pages → 选择该分支根目录
- **Netlify / Vercel**：导入仓库，无需构建命令，发布目录填 `/`

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```
