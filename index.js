const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

// 确保数据目录存在
const dataDir = path.dirname(config.dataFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 获取 App 信息
async function fetchAppInfo() {
  try {
    const url = `https://itunes.apple.com/lookup?id=${config.appId}&country=${config.countryCode}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].trackName || 'App';
    }
    return 'App';
  } catch (error) {
    console.error('获取 App 信息失败:', error.message);
    return 'App';
  }
}

// 获取评论数据
async function fetchReviews() {
  try {
    const response = await axios.get(config.getApiUrl());
    const entries = response.data.feed.entry || [];
    
    // 所有条目都是评论
    const reviews = entries.map(entry => ({
      id: entry.id.label,
      title: entry.title.label,
      content: entry.content.label,
      rating: entry['im:rating']?.label || 'N/A',
      author: entry.author.name.label,
      updated: entry.updated.label,
      timestamp: new Date(entry.updated.label).getTime()
    }));
    
    return reviews;
  } catch (error) {
    console.error('获取评论失败:', error.message);
    return [];
  }
}

// 读取历史评论
function readHistoryReviews() {
  try {
    if (fs.existsSync(config.dataFile)) {
      const data = fs.readFileSync(config.dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取历史数据失败:', error.message);
  }
  return [];
}

// 保存评论数据
function saveReviews(reviews) {
  try {
    fs.writeFileSync(config.dataFile, JSON.stringify(reviews, null, 2), 'utf8');
    console.log('评论数据已保存');
  } catch (error) {
    console.error('保存数据失败:', error.message);
  }
}

// 发送钉钉通知（汇总新评论）
async function sendDingTalkNotification(newReviews, appName) {
  if (!config.dingtalkWebhook) {
    console.log('未配置钉钉 Webhook，跳过通知');
    return;
  }

  try {
    let url = config.dingtalkWebhook;
    const timestamp = Date.now();
    let sign = '';

    // 如果配置了加签密钥
    if (config.dingtalkSecret) {
      const stringToSign = `${timestamp}\n${config.dingtalkSecret}`;
      sign = crypto.createHmac('sha256', config.dingtalkSecret)
        .update(stringToSign)
        .digest('base64');
      url += `&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
    }

    // 计算评分分布
    const ratingStats = {};
    newReviews.forEach(review => {
      const rating = review.rating || 'N/A';
      ratingStats[rating] = (ratingStats[rating] || 0) + 1;
    });

    // 构建评分统计文本
    let ratingText = '';
    for (let i = 5; i >= 1; i--) {
      if (ratingStats[i.toString()]) {
        ratingText += `${'⭐'.repeat(i)} × ${ratingStats[i.toString()]}\n\n`;
      }
    }

    // 显示最新的3条评论标题
    const previewReviews = newReviews.slice(0, 3);
    let previewText = previewReviews.map((review, index) => 
      `${index + 1}. ${review.title} (${'⭐'.repeat(parseInt(review.rating) || 0)})`
    ).join('\n\n');

    if (newReviews.length > 3) {
      previewText += `\n\n...还有 ${newReviews.length - 3} 条评论`;
    }

    const message = {
      msgtype: 'markdown',
      markdown: {
        title: `${appName} - 发现 ${newReviews.length} 条新评论`,
        text: `### 📱 ${appName}\n\n` +
              `发现 ${newReviews.length} 条新的 App Store 评论\n\n` +
              `**评分分布：**\n\n${ratingText}\n` +
              `**最新评论预览：**\n\n${previewText}\n\n` +
              `---\n\n` +
              `[点击查看完整评论](${config.webUrl}?appId=${config.appId}&country=${config.countryCode})`
      }
    };

    await axios.post(url, message);
    console.log(`已发送汇总通知: ${newReviews.length} 条新评论`);
  } catch (error) {
    console.error('发送钉钉通知失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('开始检查 App Store 评论...');
  console.log(`App ID: ${config.appId}, 国家: ${config.countryCode}`);
  
  // 获取 App 名称
  const appName = await fetchAppInfo();
  console.log(`App 名称: ${appName}`);
  
  // 获取评论
  const currentReviews = await fetchReviews();
  
  if (currentReviews.length === 0) {
    console.log('未获取到评论数据');
    return;
  }
  
  console.log(`获取到 ${currentReviews.length} 条评论`);
  
  const historyReviews = readHistoryReviews();
  const historyIds = new Set(historyReviews.map(r => r.id));
  
  // 找出新评论
  const newReviews = currentReviews.filter(review => !historyIds.has(review.id));
  
  // 发送通知
  if (newReviews.length > 0 && historyReviews.length > 0) {
    // 有新评论
    console.log(`发现 ${newReviews.length} 条新评论`);
    await sendDingTalkNotification(newReviews, appName);
  } else if (newReviews.length > 0 && historyReviews.length === 0) {
    // 首次运行
    console.log(`首次运行，发现 ${newReviews.length} 条评论，不发送通知`);
  } else {
    // 没有新评论
    console.log('没有新评论');
  }
  
  // 保存最新数据
  saveReviews(currentReviews);
  
  // 生成网页
  generateWebPage(currentReviews);
}

// 生成展示网页
function generateWebPage(reviews) {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Store 评论监控</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f7; padding: 20px; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #1d1d1f; margin-bottom: 30px; text-align: center; }
    .review-card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .review-title { font-size: 18px; font-weight: 600; color: #1d1d1f; }
    .review-rating { color: #ff9500; font-size: 16px; }
    .review-content { color: #424245; line-height: 1.6; margin-bottom: 15px; }
    .review-meta { display: flex; justify-content: space-between; color: #86868b; font-size: 14px; }
    .update-time { text-align: center; color: #86868b; margin-top: 30px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 App Store 评论监控</h1>
    ${reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-title">${escapeHtml(review.title)}</div>
        <div class="review-rating">${'⭐'.repeat(parseInt(review.rating) || 0)}</div>
      </div>
      <div class="review-content">${escapeHtml(review.content)}</div>
      <div class="review-meta">
        <span>👤 ${escapeHtml(review.author)}</span>
        <span>🕐 ${review.updated}</span>
      </div>
    </div>
    `).join('')}
    <div class="update-time">最后更新: ${new Date().toLocaleString('zh-CN')}</div>
  </div>
</body>
</html>`;

  fs.writeFileSync('./index.html', html, 'utf8');
  console.log('网页已生成: index.html');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 执行
main().catch(console.error);
