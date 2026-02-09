# 快速开始指南

## 5 分钟快速部署

### 准备工作清单

在开始之前，请准备以下信息：

- [ ] GitHub 账号
- [ ] 钉钉账号和一个群聊
- [ ] 你要监控的 App 在 App Store 的链接

---

## 第一步：获取 App ID

1. 在浏览器中打开 App Store 网页版：https://apps.apple.com
2. 搜索你要监控的应用
3. 复制浏览器地址栏的 URL，例如：
   ```
   https://apps.apple.com/cn/app/wechat/id414478124
   ```
4. 记录下 `id` 后面的数字：`414478124`
5. 记录下国家代码（URL 中的 `cn`、`us` 等）

**示例：**
- 微信（中国）：`414478124` / `cn`
- Instagram（美国）：`389801252` / `us`
- LINE（日本）：`443904275` / `jp`

---

## 第二步：创建钉钉机器人

### 2.1 添加机器人

1. 打开钉钉，进入要接收通知的群聊
2. 点击右上角 **⚙️ 群设置**
3. 选择 **智能群助手** → **添加机器人**
4. 选择 **自定义** 类型
5. 输入机器人名称：`App评论监控`
6. 点击 **完成**

### 2.2 配置安全设置（二选一）

**方式 1：加签（推荐）**
- 勾选 **加签**
- 复制并保存显示的 **SEC开头的密钥**
- 复制并保存 **Webhook 地址**

**方式 2：自定义关键词**
- 勾选 **自定义关键词**
- 输入关键词：`评论`
- 复制并保存 **Webhook 地址**

### 2.3 记录信息

你应该得到：
- ✅ Webhook URL（必需）
- ✅ 加签密钥（如果选择了加签）

---

## 第三步：Fork 或克隆项目

### 方式 1：Fork（推荐新手）

1. 访问项目 GitHub 页面
2. 点击右上角 **Fork** 按钮
3. 等待 Fork 完成

### 方式 2：克隆到本地

```bash
git clone https://github.com/your-username/appstore-review-monitor.git
cd appstore-review-monitor
```

---

## 第四步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，依次添加：

| Name | Value | 示例 |
|------|-------|------|
| `APP_ID` | 你的 App ID | `414478124` |
| `COUNTRY_CODE` | 国家代码 | `cn` |
| `DINGTALK_WEBHOOK` | 钉钉 Webhook 完整地址 | `https://oapi.dingtalk.com/robot/send?access_token=xxx` |
| `DINGTALK_SECRET` | 加签密钥（可选） | `SECxxx...` |

**详细配置步骤请查看：** [GitHub Secrets 配置指南](./github-secrets-guide.md)

---

## 第五步：启用 GitHub Actions

1. 进入仓库的 **Actions** 标签
2. 如果看到提示，点击 **I understand my workflows, go ahead and enable them**
3. 在左侧选择 **App Store Review Monitor**
4. 点击 **Enable workflow**（如果需要）

---

## 第六步：测试运行

### 手动触发测试

1. 在 **Actions** 页面
2. 选择 **App Store Review Monitor** workflow
3. 点击 **Run workflow** 下拉按钮
4. 选择分支（通常是 `main`）
5. 点击绿色的 **Run workflow** 按钮

### 查看运行结果

1. 等待几秒钟，页面会出现新的运行记录
2. 点击进入查看详细日志
3. 检查是否有错误
4. 查看钉钉群是否收到通知

---

## 第七步：查看评论网页

### 方式 1：下载查看

1. 运行完成后，在仓库中找到 `index.html`
2. 下载到本地
3. 用浏览器打开

### 方式 2：部署到 GitHub Pages

1. 进入 **Settings** → **Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 `main` 和 `/ (root)`
4. 点击 **Save**
5. 等待几分钟后访问：`https://your-username.github.io/your-repo/`

---

## 完成！

现在系统会：
- ✅ 每小时自动检查一次新评论
- ✅ 发现新评论时推送到钉钉
- ✅ 自动更新评论网页

---

## 自定义配置（可选）

### 修改检查频率

编辑 `.github/workflows/monitor.yml`：

```yaml
on:
  schedule:
    # 每 30 分钟执行一次
    - cron: '*/30 * * * *'
    
    # 每 2 小时执行一次
    - cron: '0 */2 * * *'
    
    # 每天早上 9 点执行
    - cron: '0 9 * * *'
```

### 本地测试

```bash
# 安装依赖
npm install

# 设置环境变量
export APP_ID="414478124"
export COUNTRY_CODE="cn"
export DINGTALK_WEBHOOK="your_webhook"
export DINGTALK_SECRET="your_secret"

# 运行
npm start
```

---

## 故障排查

### 问题 1：Actions 运行失败

**检查：**
- Secrets 是否配置正确
- App ID 和国家代码是否匹配
- 查看 Actions 日志中的具体错误

### 问题 2：没有收到钉钉通知

**检查：**
- Webhook 地址是否完整
- 加签密钥是否正确
- 是否有新评论（首次运行会推送所有评论）
- 钉钉机器人是否被禁用

### 问题 3：获取不到评论

**检查：**
- App ID 是否正确
- 该应用在该国家/地区是否有评论
- 尝试在浏览器中访问 API：
  ```
  https://itunes.apple.com/cn/rss/customerreviews/id=414478124/sortBy=mostRecent/json
  ```

---

## 需要帮助？

- 📖 查看 [详细文档](../README.md)
- 🔧 查看 [GitHub Secrets 配置指南](./github-secrets-guide.md)
- 💬 提交 Issue
- 📧 联系维护者

---

## 下一步

- [ ] 监控多个应用（创建多个仓库或修改代码）
- [ ] 自定义通知消息格式
- [ ] 添加评论情感分析
- [ ] 集成其他通知渠道（企业微信、Slack 等）
