# App Store 评论监控系统

自动监控 App Store 应用评论，并推送新评论到钉钉群。

## 功能特性

- ✅ 自动拉取 App Store 评论数据
- ✅ 支持自定义 AppID 和国家代码
- ✅ 网页实时预览评论（标题、内容、时间）
- ✅ 检测新评论并推送到钉钉
- ✅ GitHub Actions 自动化部署（每小时执行）

## 配置步骤

### 1. 获取钉钉 Webhook

1. 在钉钉群中添加自定义机器人
2. 选择"自定义机器人"
3. 复制 Webhook 地址
4. 如果启用了"加签"安全设置，记录密钥

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

| Secret 名称 | 说明 | 是否必需 | 示例 |
|------------|------|---------|------|
| `APP_ID` | App Store 应用 ID | 必需 | `414478124` |
| `COUNTRY_CODE` | 国家代码 | 必需 | `cn`, `us`, `jp` |
| `DINGTALK_WEBHOOK` | 钉钉机器人 Webhook | 必需 | `https://oapi.dingtalk.com/robot/send?access_token=xxx` |
| `DINGTALK_SECRET` | 钉钉加签密钥 | 可选 | `SECxxx...` |

**如何找到 App ID：**
- 在 App Store 中找到你的应用
- 查看 URL，例如：`https://apps.apple.com/cn/app/wechat/id414478124`
- 其中 `414478124` 就是 App ID

**常用国家代码：**
- `cn` - 中国
- `us` - 美国
- `jp` - 日本
- `hk` - 香港
- `tw` - 台湾

### 3. 启用 GitHub Actions

1. 将代码推送到 GitHub
2. 进入仓库的 Actions 页面
3. 启用 Workflows
4. 可以手动触发测试

### 4. 本地测试

```bash
# 安装依赖
npm install

# 配置环境变量（可选，也可以直接修改 config.js）
export APP_ID="414478124"
export COUNTRY_CODE="cn"
export DINGTALK_WEBHOOK="your_webhook_url"
export DINGTALK_SECRET="your_secret"

# 运行
npm start
```

## 查看评论网页

运行后会生成 `index.html` 文件，可以：
- 本地打开查看
- 部署到 GitHub Pages
- 部署到任何静态网站托管服务

### 部署到 GitHub Pages

1. 在仓库设置中启用 GitHub Pages
2. 选择分支和根目录
3. 访问 `https://your-username.github.io/your-repo/`

## 项目结构

```
.
├── index.js              # 主程序
├── config.js             # 配置文件
├── package.json          # 依赖配置
├── data/
│   └── reviews.json      # 评论数据存储
├── index.html            # 生成的网页
└── .github/
    └── workflows/
        └── monitor.yml   # GitHub Actions 配置
```

## 注意事项

1. GitHub Actions 免费版有使用限制，每月 2000 分钟
2. 每小时执行一次，一天约消耗 24 分钟
3. 钉钉机器人有频率限制，每分钟最多 20 条消息
4. 首次运行会将所有评论视为新评论

## 故障排查

**问题：没有收到钉钉通知**
- 检查 Webhook 地址是否正确
- 检查是否配置了加签密钥
- 查看 GitHub Actions 日志

**问题：获取不到评论**
- 检查 App ID 是否正确
- 检查国家代码是否正确
- 确认该应用在该国家/地区有评论

**问题：GitHub Actions 没有运行**
- 检查是否启用了 Workflows
- 检查 Secrets 是否配置正确
- 查看 Actions 页面的错误信息

## License

MIT
