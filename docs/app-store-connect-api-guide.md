# App Store Connect API 配置指南

本项目使用 App Store Connect API 获取评论数据，需要配置 API 密钥。

## 📋 前提条件

- 拥有 Apple Developer 账号
- 在 App Store Connect 中有应用的访问权限
- 账号角色需要有 "Customer Support" 或更高权限

---

## 🔑 步骤 1：创建 API 密钥

### 1.1 登录 App Store Connect

访问：https://appstoreconnect.apple.com/

### 1.2 进入 API 密钥管理

1. 点击顶部的 **"用户和访问"** (Users and Access)
2. 点击 **"密钥"** (Keys) 标签
3. 点击左侧的 **"App Store Connect API"**

### 1.3 生成新密钥

1. 点击 **"+"** 或 **"生成 API 密钥"**
2. 填写信息：
   - **名称**：`Review Monitor`（或任何你喜欢的名字）
   - **访问权限**：选择 **"Customer Support"**（客户支持）
3. 点击 **"生成"**

### 1.4 记录密钥信息

生成后会显示三个重要信息：

1. **Issuer ID**（发行者 ID）
   - 格式：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - 在页面顶部显示
   - 复制并保存

2. **Key ID**（密钥 ID）
   - 格式：`XXXXXXXXXX`（10 位字符）
   - 在密钥列表中显示
   - 复制并保存

3. **Private Key**（私钥文件）
   - 点击 **"下载 API 密钥"** 按钮
   - 会下载一个 `.p8` 文件（例如：`AuthKey_XXXXXXXXXX.p8`）
   - ⚠️ **只能下载一次**，请妥善保存！

---

## 📄 步骤 2：准备私钥内容

### 2.1 打开 .p8 文件

用文本编辑器打开下载的 `.p8` 文件，内容类似：

```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
...更多内容...
-----END PRIVATE KEY-----
```

### 2.2 复制完整内容

复制从 `-----BEGIN PRIVATE KEY-----` 到 `-----END PRIVATE KEY-----` 的**完整内容**（包括开头和结尾）。

---

## 🔧 步骤 3：配置 GitHub Secrets

访问：https://github.com/Y-HLiang/AppleReviewBot/settings/secrets/actions

添加以下 Secrets：

### 3.1 API_KEY_ID

- **Name**: `API_KEY_ID`
- **Secret**: 粘贴你的 Key ID（10 位字符）
- 示例：`ABCDE12345`

### 3.2 API_ISSUER_ID

- **Name**: `API_ISSUER_ID`
- **Secret**: 粘贴你的 Issuer ID（UUID 格式）
- 示例：`12345678-1234-1234-1234-123456789012`

### 3.3 API_KEY_CONTENT

- **Name**: `API_KEY_CONTENT`
- **Secret**: 粘贴你的私钥完整内容（包括 BEGIN 和 END 行）
- 示例：
  ```
  -----BEGIN PRIVATE KEY-----
  MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
  -----END PRIVATE KEY-----
  ```

### 3.4 APP_ID

- **Name**: `APP_ID`
- **Secret**: 你的应用 ID
- 示例：`1234567890`

**如何获取 App ID：**
1. 登录 App Store Connect
2. 进入 **"我的 App"**
3. 选择你的应用
4. 在 **"App 信息"** 页面，找到 **"Apple ID"**

### 3.5 DINGTALK_WEBHOOK（必需）

- **Name**: `DINGTALK_WEBHOOK`
- **Secret**: 钉钉机器人 Webhook URL

### 3.6 DINGTALK_SECRET（可选）

- **Name**: `DINGTALK_SECRET`
- **Secret**: 钉钉加签密钥（如果启用了加签）

---

## ✅ 步骤 4：测试运行

1. 访问：https://github.com/Y-HLiang/AppleReviewBot/actions
2. 选择 **"App Store Review Monitor"**
3. 点击 **"Run workflow"**
4. 等待运行完成
5. 检查日志和钉钉通知

---

## 🔒 安全注意事项

### 重要提醒：

1. **私钥安全**
   - ⚠️ 私钥只能下载一次
   - 不要将私钥提交到代码仓库
   - 不要在公开场合分享
   - 只通过 GitHub Secrets 配置

2. **密钥权限**
   - 只授予必要的权限（Customer Support）
   - 定期检查密钥使用情况
   - 如果泄露，立即撤销并重新生成

3. **密钥管理**
   - 在 App Store Connect 中可以随时撤销密钥
   - 建议定期更换密钥
   - 为不同项目使用不同的密钥

---

## 🆚 API 对比

### App Store Connect API vs RSS Feed

| 特性 | App Store Connect API | RSS Feed |
|------|----------------------|----------|
| 实时性 | ✅ 实时数据 | ❌ 延迟更新（每天固定时间） |
| 数据量 | ✅ 最多 200 条 | ⚠️ 最多 50 条 |
| 认证 | ⚠️ 需要 API 密钥 | ✅ 无需认证 |
| 稳定性 | ✅ 官方 API | ✅ 稳定 |
| 详细信息 | ✅ 更多字段 | ⚠️ 基本信息 |
| 国家筛选 | ✅ 支持 | ✅ 支持 |

---

## ❓ 常见问题

### Q1: 找不到 "用户和访问" 菜单？

**原因**：账号权限不足

**解决**：
- 需要 Account Holder、Admin 或 App Manager 角色
- 联系账号管理员授予权限

### Q2: 无法生成 API 密钥？

**原因**：账号类型限制

**解决**：
- 个人开发者账号可能有限制
- 企业账号通常没有问题
- 确保账号已完成所有验证

### Q3: API 返回 401 错误？

**检查**：
- API_KEY_ID 是否正确
- API_ISSUER_ID 是否正确
- API_KEY_CONTENT 是否完整（包括 BEGIN 和 END）
- 私钥格式是否正确

### Q4: API 返回 403 错误？

**原因**：权限不足

**解决**：
- 确保 API 密钥有 "Customer Support" 权限
- 确保账号有访问该应用的权限

### Q5: 私钥文件丢失了怎么办？

**解决**：
1. 在 App Store Connect 中撤销旧密钥
2. 生成新的 API 密钥
3. 重新配置 GitHub Secrets

---

## 📞 需要帮助？

- Apple 官方文档：https://developer.apple.com/documentation/appstoreconnectapi
- App Store Connect API 参考：https://developer.apple.com/documentation/appstoreconnectapi/list_all_customer_reviews_for_an_app

---

**配置完成后，系统就可以实时获取 App Store 评论了！** 🎉
