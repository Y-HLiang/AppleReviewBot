# GitHub 两步验证（2FA）问题解决指南

## 问题：登录时要求输入 code，但 app 里没有收到

这是 GitHub 的两步验证（Two-Factor Authentication）。有几种方式可以获取验证码：

---

## 🔍 方式 1：使用身份验证器 App（推荐）

### 常用的身份验证器 App：

1. **Google Authenticator**（推荐）
   - iOS: https://apps.apple.com/app/google-authenticator/id388497605
   - Android: https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2

2. **Microsoft Authenticator**
   - iOS: https://apps.apple.com/app/microsoft-authenticator/id983156458
   - Android: https://play.google.com/store/apps/details?id=com.azure.authenticator

3. **Authy**
   - iOS: https://apps.apple.com/app/authy/id494168017
   - Android: https://play.google.com/store/apps/details?id=com.authy.authy

### 如何使用：

1. **下载并安装**上述任一 App
2. **打开 App**，应该能看到 GitHub 账号
3. **查看 6 位数字验证码**（每 30 秒更新一次）
4. **在 GitHub 登录页面输入**这个 6 位数字

---

## 📱 方式 2：使用短信验证码

如果你设置了手机号码：

1. 在 GitHub 登录页面，点击 **"Use SMS"** 或 **"Send SMS"**
2. 等待接收短信验证码
3. 输入收到的验证码

---

## 🔑 方式 3：使用恢复代码

如果你保存了恢复代码（Recovery Codes）：

1. 在 GitHub 登录页面，点击 **"Use a recovery code"**
2. 输入你保存的恢复代码之一
3. ⚠️ 每个恢复代码只能使用一次

---

## ❌ 如果以上方式都不行

### 情况 A：你有其他已登录的设备

如果你在其他设备（手机、平板、电脑）上已经登录了 GitHub：

1. 在已登录的设备上访问：https://github.com/settings/security
2. 找到 **Two-factor authentication** 部分
3. 可以：
   - 查看恢复代码
   - 重新配置身份验证器
   - 添加新的验证方式

### 情况 B：完全无法访问

如果你：
- ❌ 没有身份验证器 App 或看不到 GitHub
- ❌ 没有收到短信
- ❌ 没有保存恢复代码
- ❌ 没有其他已登录的设备

**需要联系 GitHub 支持：**

1. 访问：https://support.github.com/contact
2. 选择 **Account and profile** → **Account security**
3. 说明情况：无法访问两步验证
4. 提供你的：
   - GitHub 用户名
   - 注册邮箱
   - 账号相关信息（仓库、贡献记录等）

---

## 🚀 临时解决方案：使用 SSH 推送（无需登录网页）

如果你只是想推送代码，可以不登录网页，直接使用 SSH：

### 步骤：

1. **生成 SSH 密钥**（如果还没有）
   
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   
   一路按回车使用默认设置

2. **查看公钥**
   
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   
   复制输出的全部内容

3. **添加 SSH 密钥到 GitHub**
   
   问题：需要登录网页才能添加...
   
   **解决**：如果你有其他已登录的设备，在那个设备上：
   - 访问：https://github.com/settings/keys
   - 点击 **New SSH key**
   - 粘贴公钥
   - 保存

4. **使用 SSH 推送**
   
   ```bash
   git remote set-url origin git@github.com:Y-HLiang/AppleReviewBot.git
   git push -u origin main
   ```

---

## 💡 最佳实践建议

为了避免将来再次遇到这个问题：

### 1. 保存恢复代码

登录后立即：
1. 访问：https://github.com/settings/security
2. 找到 **Recovery codes**
3. 点击 **Generate new recovery codes**
4. **下载或打印保存**这些代码
5. 存放在安全的地方（密码管理器、保险箱等）

### 2. 配置多个验证方式

1. 身份验证器 App（主要）
2. 短信验证（备用）
3. 保存恢复代码（紧急）

### 3. 使用密码管理器

推荐使用：
- **1Password**（支持 2FA 验证码）
- **Bitwarden**
- **LastPass**

这些工具可以同时保存密码和 2FA 验证码。

---

## 🔧 针对你的情况

### 检查清单：

1. **确认安装的是哪个 App？**
   - GitHub Mobile？（这个不显示验证码）
   - 身份验证器 App？（Google Authenticator、Microsoft Authenticator 等）

2. **如果是 GitHub Mobile App**
   - ❌ GitHub Mobile 不是用来显示验证码的
   - ✅ 需要安装 **Google Authenticator** 或类似 App

3. **如果是身份验证器 App**
   - 打开 App
   - 查找 "GitHub" 或你的用户名
   - 应该显示 6 位数字（每 30 秒变化）

4. **如果身份验证器里没有 GitHub**
   - 说明之前没有正确设置
   - 需要使用恢复代码或联系 GitHub 支持

---

## 📞 立即可行的方案

### 方案 1：使用恢复代码（如果有）

在登录页面点击 **"Use a recovery code"**，输入你保存的恢复代码。

### 方案 2：使用短信验证（如果设置了）

在登录页面点击 **"Use SMS"**，等待接收短信。

### 方案 3：在其他设备上操作

如果你的手机或其他电脑已经登录了 GitHub，在那个设备上：
1. 配置 SSH 密钥
2. 或者查看恢复代码
3. 或者临时关闭 2FA（不推荐）

### 方案 4：联系 GitHub 支持

访问：https://support.github.com/contact

---

## ❓ 常见问题

**Q: GitHub Mobile App 在哪里看验证码？**

A: GitHub Mobile 不显示验证码。需要安装 Google Authenticator 等身份验证器 App。

**Q: 我忘记设置了哪个身份验证器？**

A: 常见的有：
- Google Authenticator
- Microsoft Authenticator  
- Authy
- 1Password
- Bitwarden

逐个检查这些 App。

**Q: 可以临时关闭 2FA 吗？**

A: 必须先登录才能关闭，所以需要先解决登录问题。

---

**告诉我你的具体情况，我可以提供更针对性的帮助！**

例如：
- 你安装的是什么 App？
- 是否有其他已登录的设备？
- 是否保存了恢复代码？
- 是否设置了手机号码？
