# GitHub Actions 启用和使用指南

## 📍 当前状态检查

访问你的 Actions 页面：https://github.com/Y-HLiang/AppleReviewBot/actions

---

## 🎯 根据你看到的页面，选择对应的操作：

### 场景 1：看到绿色提示按钮

如果页面显示：
```
"I understand my workflows, go ahead and enable them"
```

**操作**：点击这个绿色按钮即可启用。

---

### 场景 2：看到 "Get started with GitHub Actions"

说明 Actions 功能未启用。

**操作步骤**：

1. 点击页面右上角的 **Settings**（设置）
2. 在左侧菜单找到 **Actions** → **General**
3. 在 "Actions permissions" 部分，选择：
   - ✅ **Allow all actions and reusable workflows**
4. 滚动到页面底部，点击 **Save**
5. 返回 Actions 页面：https://github.com/Y-HLiang/AppleReviewBot/actions

---

### 场景 3：左侧显示 "All workflows" 或 workflow 名称

说明 Actions 已经启用！

**你应该看到**：
- 左侧：**App Store Review Monitor** workflow
- 右侧：可以点击 **Run workflow** 按钮

**下一步**：直接进行手动测试（见下方）

---

### 场景 4：显示 "Actions are disabled"

**操作步骤**：

1. 点击 **Settings** → **Actions** → **General**
2. 在 "Actions permissions" 部分
3. 选择 **Allow all actions and reusable workflows**
4. 点击 **Save**

---

## 🚀 手动触发 Workflow（测试）

启用后，进行首次测试：

### 步骤：

1. 访问：https://github.com/Y-HLiang/AppleReviewBot/actions

2. 在左侧点击 **App Store Review Monitor**

3. 在右侧会看到 **Run workflow** 按钮（灰色下拉按钮）

4. 点击 **Run workflow** 下拉按钮

5. 确认分支是 **main**

6. 点击绿色的 **Run workflow** 按钮

7. 等待几秒钟，页面会出现新的运行记录

8. 点击进入查看详细日志

---

## 📊 查看运行结果

### 成功的标志：

- ✅ 所有步骤都有绿色的 ✓
- ✅ "Run monitor" 步骤显示获取到评论
- ✅ 钉钉群收到通知（如果有新评论）
- ✅ 仓库中生成了 `index.html` 和 `data/reviews.json`

### 如果失败：

点击红色的 ✗ 查看错误信息，常见问题：

1. **"Error: Process completed with exit code 1"**
   - 检查 Secrets 是否配置正确
   - 检查 App ID 和国家代码是否匹配

2. **"npm ERR! missing script: start"**
   - 不应该出现，package.json 已包含 start 脚本

3. **"获取评论失败"**
   - 检查 App ID 是否正确
   - 检查该应用在该国家是否有评论
   - 尝试访问：`https://itunes.apple.com/cn/rss/customerreviews/id=你的AppID/sortBy=mostRecent/json`

4. **"发送钉钉通知失败"**
   - 检查 DINGTALK_WEBHOOK 是否正确
   - 检查 DINGTALK_SECRET 是否正确（如果使用了加签）

---

## ⚙️ 配置 Secrets（必需）

在运行 workflow 之前，必须先配置 Secrets：

### 访问：
https://github.com/Y-HLiang/AppleReviewBot/settings/secrets/actions

### 添加以下 Secrets：

| Name | Value | 必需 | 示例 |
|------|-------|------|------|
| `APP_ID` | App Store 应用 ID | ✅ | `414478124` |
| `COUNTRY_CODE` | 国家代码（小写） | ✅ | `cn` |
| `DINGTALK_WEBHOOK` | 钉钉机器人 Webhook | ✅ | `https://oapi.dingtalk.com/robot/send?access_token=xxx` |
| `DINGTALK_SECRET` | 钉钉加签密钥 | ⭕ | `SECxxx...` |

### 如何添加：

1. 点击 **New repository secret**
2. Name 输入：`APP_ID`
3. Secret 输入：你的 App ID
4. 点击 **Add secret**
5. 重复以上步骤添加其他 Secrets

---

## 🔄 自动运行

配置完成后，系统会：
- ⏰ 每小时自动运行一次（整点）
- 🔍 检查是否有新评论
- 📱 发现新评论时推送到钉钉
- 📄 更新 `index.html` 网页

---

## 📱 查看评论网页

### 方式 1：下载查看

1. 运行完成后，访问仓库首页
2. 找到 `index.html` 文件
3. 点击 **Raw** 或下载
4. 用浏览器打开

### 方式 2：部署到 GitHub Pages

1. 访问：https://github.com/Y-HLiang/AppleReviewBot/settings/pages
2. **Source** 选择：**Deploy from a branch**
3. **Branch** 选择：**main** 和 **/ (root)**
4. 点击 **Save**
5. 等待几分钟后访问：https://y-hliang.github.io/AppleReviewBot/

---

## 🔧 修改运行频率

如果想修改检查频率，编辑 `.github/workflows/monitor.yml`：

```yaml
on:
  schedule:
    # 每 30 分钟
    - cron: '*/30 * * * *'
    
    # 每 2 小时
    - cron: '0 */2 * * *'
    
    # 每天 9:00
    - cron: '0 9 * * *'
    
    # 每天 9:00 和 18:00
    - cron: '0 9,18 * * *'
```

修改后提交推送即可生效。

---

## ❓ 常见问题

### Q: 为什么左侧没有显示 workflow？

**可能原因**：
1. Actions 未启用 → 去 Settings → Actions 启用
2. workflow 文件有语法错误 → 检查 `.github/workflows/monitor.yml`
3. 刚推送代码，需要刷新页面

### Q: 点击 "Run workflow" 没有反应？

**解决**：
1. 刷新页面
2. 检查是否配置了 Secrets
3. 查看浏览器控制台是否有错误

### Q: workflow 运行失败怎么办？

**步骤**：
1. 点击失败的运行记录
2. 展开红色 ✗ 的步骤
3. 查看错误信息
4. 根据错误信息修复问题
5. 重新运行或等待下次自动运行

### Q: 如何停止自动运行？

**方法 1**：禁用 workflow
1. Actions 页面
2. 点击左侧的 workflow 名称
3. 点击右上角的 **...** 菜单
4. 选择 **Disable workflow**

**方法 2**：删除 workflow 文件
```bash
git rm .github/workflows/monitor.yml
git commit -m "Disable workflow"
git push
```

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Actions 运行日志
2. 检查 Secrets 配置
3. 查看 [README.md](../README.md)
4. 提交 Issue

---

**配置完成后，系统就会自动监控评论并推送到钉钉了！** 🎉
