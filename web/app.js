// 配置
const DATA_URL = '../data/reviews.json';

// 全局变量
let allReviews = [];
let filteredReviews = [];
let currentRatingFilter = 'all';
let currentSearchTerm = '';

// DOM 元素
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const reviewsListEl = document.getElementById('reviewsList');
const noResultsEl = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// 初始化
async function init() {
  try {
    await loadReviews();
    setupEventListeners();
    renderReviews();
    updateStats();
  } catch (error) {
    showError();
  }
}

// 加载评论数据
async function loadReviews() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('Failed to load reviews');
    allReviews = await response.json();
    filteredReviews = [...allReviews];
    hideLoading();
  } catch (error) {
    console.error('Error loading reviews:', error);
    throw error;
  }
}

// 设置事件监听
function setupEventListeners() {
  // 评分筛选
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRatingFilter = btn.dataset.rating;
      applyFilters();
    });
  });

  // 搜索
  searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    applyFilters();
  });
}

// 应用筛选
function applyFilters() {
  filteredReviews = allReviews.filter(review => {
    // 评分筛选
    const ratingMatch = currentRatingFilter === 'all' || 
                       review.rating === currentRatingFilter;
    
    // 搜索筛选
    const searchMatch = !currentSearchTerm || 
                       review.title.toLowerCase().includes(currentSearchTerm) ||
                       review.content.toLowerCase().includes(currentSearchTerm) ||
                       review.author.toLowerCase().includes(currentSearchTerm);
    
    return ratingMatch && searchMatch;
  });

  renderReviews();
}

// 渲染评论列表
function renderReviews() {
  if (filteredReviews.length === 0) {
    reviewsListEl.innerHTML = '';
    noResultsEl.style.display = 'block';
    return;
  }

  noResultsEl.style.display = 'none';
  
  const html = filteredReviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-title">${escapeHtml(review.title)}</div>
        <div class="review-rating">
          <span class="rating-stars">${getStars(review.rating)}</span>
          <span class="rating-number">${review.rating}</span>
        </div>
      </div>
      <div class="review-content">${escapeHtml(review.content)}</div>
      <div class="review-meta">
        <div class="review-author">
          <span>👤</span>
          <span>${escapeHtml(review.author)}</span>
        </div>
        <div class="review-date">
          <span>🕐</span>
          <span>${formatDate(review.updated)}</span>
        </div>
      </div>
    </div>
  `).join('');

  reviewsListEl.innerHTML = html;
}

// 更新统计信息
function updateStats() {
  // 总评论数
  document.getElementById('totalCount').textContent = allReviews.length;

  // 平均评分
  if (allReviews.length > 0) {
    const avgRating = allReviews.reduce((sum, review) => {
      const rating = parseInt(review.rating) || 0;
      return sum + rating;
    }, 0) / allReviews.length;
    document.getElementById('avgRating').textContent = avgRating.toFixed(1) + ' ⭐';
  } else {
    document.getElementById('avgRating').textContent = '-';
  }

  // 最后更新时间
  if (allReviews.length > 0) {
    const latestDate = new Date(allReviews[0].updated);
    document.getElementById('lastUpdate').textContent = formatDate(allReviews[0].updated);
  } else {
    document.getElementById('lastUpdate').textContent = '-';
  }
}

// 工具函数
function getStars(rating) {
  const num = parseInt(rating) || 0;
  return '⭐'.repeat(num);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  
  return date.toLocaleDateString('zh-CN');
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

function hideLoading() {
  loadingEl.style.display = 'none';
}

function showError() {
  loadingEl.style.display = 'none';
  errorEl.style.display = 'block';
}

// 启动应用
init();
