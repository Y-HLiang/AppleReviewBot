# 推送代码到 GitHub 指南

你的仓库地址：https://github.com/Y-HLiang/AppleReviewBot.git

代码已经准备好，现在需要推送到 GitHub。请选择以下任一方式：

---

## 🎯 方式 1：使用 GitHub Desktop（最简单，推荐新手）

### 步骤：

1. **下载安装 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **登录 GitHub 账号**
   - 打开 GitHub Desktop
   - 点击 **Sign in to GitHub.com**
   - 输入你的 GitHub 用户名和密码

3. **添加本地仓库**
   - 点击菜单 **File** → **Add Local Repository**
   - 点击 **Choose...** 按钮
   - 选择当前项目文件夹（AppleReviewDemo）
   - 点击 **Add Repository**

4. **发布到 GitHub**
   - 点击顶部的 **Publish repository** 按钮
   - 确认仓库名称：`AppleReviewBot`
   - 取消勾选 **Keep this code private**（如果你想公开）
   - 点击 **Publish repository**

5. **完成！**
   - 访问 https://github.com/Y-HLiang/AppleReviewBot 查看代码

---

## 🔑 方式 2：使用 Personal Access Token（命令行）

### 步骤：

1. **创建 Personal Access Token**
   
   a. 访问：https://github.com/settings/tokens
   
   b. 点击 **Generate new token** → **Generate new token (classic)**
   
   c. 填写信息：
      - Note: `AppleReviewBot Push`
      - Expiration: 选择过期时间（建议 90 days）
      - 勾选权限：**repo**（勾选整个 repo 部分）
   
   d. 点击页面底部的 **Generate token**
   
   e. **重要**：复制显示的 token（格式：ghp_xxxxxxxxxxxx）
      - ⚠️ 这个 token 只显示一次，请立即保存！

2. **在终端中推送代码**
   
   打开终端，在项目目录下执行：
   
   ```bash
   git push -u origin main
   ```
   
   会提示输入：
   ```
   Username for 'https://github.com': Y-HLiang
   Password for 'https://Y-HLiang@github.com': 
   ```
   
   - Username 输入：`Y-HLiang`
   - Password 输入：**粘贴你刚才复制的 token**（不是 GitHub 密码！）

3. **完成！**
   - 看到 "Branch 'main' set up to track remote branch 'main' from 'origin'" 表示成功

---

## 🔐 方式 3：使用 SSH（推荐长期使用）

### 步骤：

1. **检查是否已有 SSH 密钥**
   
   ```bash
   ls -la ~/.ssh
   ```
   
   如果看到 `id_rsa.pub` 或 `id_ed25519.pub`，说明已有密钥，跳到步骤 3

2. **生成新的 SSH 密钥**
   
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   
   - 按回车使用默认文件位置
   - 可以设置密码或直接回车跳过
   - 再次回车确认

3. **复制 SSH 公钥**
   
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   
   或
   
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
   
   复制输出的全部内容（以 ssh-ed25519 或 ssh-rsa 开头）

4. **添加 SSH 密钥到 GitHub**
   
   a. 访问：https://github.com/settings/keys
   
   b. 点击 **New SSH key**
   
   c. 填写：
      - Title: `My Mac`（或任何你喜欢的名字）
      - Key: 粘贴刚才复制的公钥
   
   d. 点击 **Add SSH key**

5. **切换到 SSH 地址并推送**
   
   ```bash
   git remote set-url origin git@github.com:Y-HLiang/AppleReviewBot.git
   git push -u origin main
   ```

6. **首次连接确认**
   
   如果提示：
   ```
   The authenticity of host 'github.com' can't be established.
   Are you sure you want to continue connecting (yes/no)?
   ```
   
   输入 `yes` 并回车

7. **完成！**

---

## ✅ 推送成功后的验证

1. 访问你的仓库：https://github.com/Y-HLiang/AppleReviewBot
2. 应该能看到所有文件：
   - ✅ README.md
   - ✅ index.js
   - ✅ config.js
   - ✅ package.json
   - ✅ .github/workflows/monitor.yml
   - ✅ docs/ 文件夹

---

## 🚀 推送成功后的下一步

### 1. 配置 GitHub Secrets

访问：https://github.com/Y-HLiang/AppleReviewBot/settings/secrets/actions

添加以下 Secrets：

| Name | Value | 说明 |
|------|-------|------|
| `APP_ID` | 你的 App ID | 例如：1526117209 |
| `COUNTRY_CODE` | 国家代码 | 例如：tw |
| `DINGTALK_WEBHOOK` | 钉钉 Webhook | 完整 URL |
| `DINGTALK_SECRET` | 加签密钥 | 可选 |

详细配置步骤：[docs/github-secrets-guide.md](docs/github-secrets-guide.md)

### 2. 启用 GitHub Actions

1. 访问：https://github.com/Y-HLiang/AppleReviewBot/actions
2. 如果看到提示，点击 **I understand my workflows, go ahead and enable them**
3. 选择 **App Store Review Monitor**
4. 点击 **Run workflow** 测试

### 3. 部署 GitHub Pages（可选）

1. 访问：https://github.com/Y-HLiang/AppleReviewBot/settings/pages
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **main** 和 **/ (root)**
4. 点击 **Save**
5. 等待几分钟后访问：https://y-hliang.github.io/AppleReviewBot/

---

## ❓ 常见问题

### Q: Token 或密码输入错误怎么办？

**macOS/Linux:**
```bash
# 清除保存的凭据
git credential-osxkeychain erase
host=github.com
protocol=https

# 然后重新推送
git push -u origin main
```

### Q: 推送时提示 "Repository not found"？

检查：
1. 仓库地址是否正确
2. 是否有仓库的访问权限
3. 仓库是否已创建

### Q: 如何更新已推送的代码？

```bash
# 修改代码后
git add .
git commit -m "Update: 描述你的修改"
git push
```

---

## 📞 需要帮助？

- 查看 GitHub 官方文档：https://docs.github.com/zh
- 查看项目 README：[README.md](README.md)
- 查看快速开始：[docs/quick-start.md](docs/quick-start.md)

---

**选择最适合你的方式，完成推送后告诉我，我会帮你继续配置！** 🚀
