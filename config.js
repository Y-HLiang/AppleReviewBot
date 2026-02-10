module.exports = {
  // App Store 配置
  appId: process.env.APP_ID || '414478124', // 默认微信 AppID
  countryCode: process.env.COUNTRY_CODE || 'cn', // 国家代码
  
  // 钉钉配置
  dingtalkWebhook: process.env.DINGTALK_WEBHOOK || '',
  dingtalkSecret: process.env.DINGTALK_SECRET || '',
  
  // GitHub Pages 地址
  webUrl: process.env.WEB_URL || 'https://y-hliang.github.io/AppleReviewBot/web/',
  
  // 数据存储文件
  dataFile: './data/reviews.json',
  
  // API 地址模板
  getApiUrl: function() {
    return `https://itunes.apple.com/${this.countryCode}/rss/customerreviews/id=${this.appId}/sortBy=mostRecent/json`;
  }
};
