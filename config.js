module.exports = {
  // App Store 配置
  appId: process.env.APP_ID || '414478124', // 默认微信 AppID，请修改
  countryCode: process.env.COUNTRY_CODE || 'cn', // 国家代码
  
  // 钉钉配置
  dingtalkWebhook: process.env.DINGTALK_WEBHOOK || '',
  dingtalkSecret: process.env.DINGTALK_SECRET || '', // 可选，如果启用了加签
  
  // 数据存储文件
  dataFile: './data/reviews.json',
  
  // API 地址模板
  getApiUrl: function() {
    return `https://itunes.apple.com/${this.countryCode}/rss/customerreviews/id=${this.appId}/sortBy=mostRecent/json`;
  }
};
