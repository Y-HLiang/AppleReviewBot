# GitHub Secrets 配置指南

## 步骤 1：进入仓库设置

1. 打开你的 GitHub 仓库页面
2. 点击顶部的 **Settings**（设置）标签

![Settings](https://user-images.githubusercontent.com/placeholder/settings.png)

## 步骤 2：找到 Secrets 设置

1. 在左侧菜单中找到 **Secrets and variables**
2. 点击展开，选择 **Actions**

![Secrets Menu](https://user-images.githubusercontent.com/placeholder/secrets-menu.png)

## 步骤 3：添加 Secrets

点击右上角的 **New repository secret** 按钮

### 3.1 添加 APP_ID

- **Name**: `APP_ID`
- **Secret**: 输入你的 App Store 应用 ID（纯数字）
- 点击 **Add secret**

**如何获取 App ID：**
1. 在浏览器中打开 App Store
2. 搜索你的应用
3. 查看 URL，例如：
   ```
   https://apps.apple.com/cn/app/wechat/id414478124
   ```
4. 其中 `414478124` 就是 App ID

### 3.2 添加 COUNTRY_CODE

- **Name**: `COUNTRY_CODE`
- **Secret**: 输入国家代码（小写字母）
- 点击 **Add secret**

**常用国家代码：**
- `cn` - 中国大陆
- `us` - 美国
- `jp` - 日本
- `hk` - 香港
- `tw` - 台湾
- `gb` - 英国
- `de` - 德国
- `fr` - 法国
- `kr` - 韩国
- `au` - 澳大利亚

### 3.3 添加 DINGTALK_WEBHOOK

- **Name**: `DINGTALK_WEBHOOK`
- **Secret**: 输入钉钉机器人的完整 Webhook URL
- 点击 **Add secret**

**如何获取钉钉 Webhook：**

1. 打开钉钉电脑版或网页版
2. 进入要接收通知的群聊
3. 点击右上角的群设置（⚙️）
4. 选择 **智能群助手** 或 **群机器人**
5. 点击 **添加机器人**
6. 选择 **自定义机器人**
7. 设置机器人名称（例如：App评论监控）
8. 选择安全设置：
   - **推荐**：选择"加签"（更安全）
   - 或选择"自定义关键词"（输入：评论）
   <!-- https://oapi.dingtalk.com/robot/send?access_token=b5a106cebb0a440f79ba62d8e366b56f1facdc7b8e6dcf669f86bf99bf8f5c3b -->
   <!-- SEC3d7479fb8e5408733a42bc4bcb28e2d474a8646fc84d999ed4eec8a8dd2791f6 -->
9. 复制 Webhook 地址，格式如下：
   ```
   https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxxxxxxxxx
   ```
10. 如果选择了"加签"，还要复制密钥（下一步需要）

### 3.4 添加 DINGTALK_SECRET（可选但推荐）

⚠️ **只有在钉钉机器人启用了"加签"安全设置时才需要配置**

- **Name**: `DINGTALK_SECRET`
- **Secret**: 输入钉钉机器人的加签密钥
- 点击 **Add secret**

密钥格式类似：
```
SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 步骤 4：验证配置

配置完成后，你应该看到以下 Secrets：

- ✅ `APP_ID`
- ✅ `COUNTRY_CODE`
- ✅ `DINGTALK_WEBHOOK`
- ✅ `DINGTALK_SECRET`（如果使用加签）

![Secrets List](https://user-images.githubusercontent.com/placeholder/secrets-list.png)

## 步骤 5：测试运行

### 方法 1：手动触发（推荐首次测试）

1. 点击仓库顶部的 **Actions** 标签
2. 在左侧选择 **App Store Review Monitor** workflow
3. 点击右侧的 **Run workflow** 按钮
4. 选择分支（通常是 main）
5. 点击绿色的 **Run workflow** 按钮

### 方法 2：等待自动执行

- 系统会在每小时的整点自动执行
- 首次运行可能需要等待

## 步骤 6：查看运行结果

1. 在 **Actions** 页面可以看到运行历史
2. 点击某次运行可以查看详细日志
3. 检查钉钉群是否收到通知
4. 查看仓库中生成的 `index.html` 和 `data/reviews.json`

## 常见问题

### Q1: 找不到 Secrets 设置？

**原因**：你可能没有仓库的管理员权限

**解决**：
- 确保你是仓库的 Owner 或有 Admin 权限
- 如果是组织仓库，联系组织管理员

### Q2: Actions 没有运行？

**检查清单**：
- ✅ 是否推送了 `.github/workflows/monitor.yml` 文件
- ✅ 是否启用了 Actions（Settings → Actions → General）
- ✅ 是否配置了所有必需的 Secrets
- ✅ 查看 Actions 页面是否有错误信息

### Q3: 钉钉没有收到通知？

**检查清单**：
- ✅ Webhook 地址是否正确（包含 access_token）
- ✅ 如果使用加签，Secret 是否正确
- ✅ 如果使用关键词，消息中是否包含该关键词
- ✅ 是否有新评论（首次运行会推送所有评论）
- ✅ 查看 Actions 日志中的错误信息

### Q4: 如何修改 Secret？

1. 进入 Secrets 页面
2. 点击要修改的 Secret 右侧的 **Update** 按钮
3. 输入新值
4. 点击 **Update secret**

### Q5: 如何删除 Secret？

1. 进入 Secrets 页面
2. 点击要删除的 Secret 右侧的 **Remove** 按钮
3. 确认删除

## 安全提示

⚠️ **重要**：
- 不要将 Webhook 和 Secret 直接写在代码中
- 不要在公开场合分享这些信息
- 定期更换钉钉机器人的 Webhook
- 如果 Secret 泄露，立即重新生成

## 下一步

配置完成后，你可以：

1. ✅ 等待系统自动运行（每小时一次）
2. ✅ 手动触发测试
3. ✅ 查看生成的网页 `index.html`
4. ✅ 根据需要调整配置（修改 `config.js` 或 `.github/workflows/monitor.yml`）

如有问题，请查看 Actions 日志或提交 Issue。
