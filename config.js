module.exports = {
  // App Store Connect API 配置
  appId: process.env.APP_ID || '414478124',
  
  // App Store Connect API 认证信息
  apiKeyId: process.env.API_KEY_ID || '', // Key ID
  apiIssuerId: process.env.API_ISSUER_ID || '', // Issuer ID
  apiKeyContent: process.env.API_KEY_CONTENT || '', // Private Key 内容（.p8 文件内容）
  
  // 钉钉配置
  dingtalkWebhook: process.env.DINGTALK_WEBHOOK || '',
  dingtalkSecret: process.env.DINGTALK_SECRET || '',
  
  // GitHub Pages 地址
  webUrl: process.env.WEB_URL || 'https://y-hliang.github.io/AppleReviewBot/web/',
  
  // 数据存储文件
  dataFile: './data/reviews.json',
  
  // App Store Connect API 地址
  getApiUrl: function() {
    return `https://api.appstoreconnect.apple.com/v1/apps/${this.appId}/customerReviews`;
  }
};
