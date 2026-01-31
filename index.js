import { fetchUtilities } from './csvParser.js';

// State
let utilities = [];
let searchTerm = '';

// Elements
const contentArea = document.getElementById('content-area');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const searchTermDisplay = document.getElementById('search-term-display');
const yearSpan = document.getElementById('year');
const themeToggle = document.getElementById('theme-toggle');

// Sections
const sections = {
  ai: document.getElementById('section-ai'),
  analytics: document.getElementById('section-analytics')
};
const grids = {
  ai: document.getElementById('grid-ai'),
  analytics: document.getElementById('grid-analytics')
};
const counts = {
  ai: document.getElementById('count-ai'),
  analytics: document.getElementById('count-analytics')
};

// Theme
function initTheme() {
  const saved = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && system)) {
    document.documentElement.classList.add('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  lucide.createIcons();
}

// Data Init
async function init() {
  initTheme();
  yearSpan.textContent = new Date().getFullYear();
  
  // Shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  try {
    utilities = await fetchUtilities();
    
    // Simulate slight delay for polish
    setTimeout(() => {
      render();
      loader.classList.add('hidden');
      contentArea.classList.remove('hidden');
      // Simple entrance animation
      contentArea.classList.add('animate-fade-up');
    }, 400);
  } catch (err) {
    console.error(err);
    loader.innerHTML = '<p class="text-red-500 font-medium">Unable to load tools.</p>';
  }
}

function getCardHTML(u) {
  const isAI = u.type === 'AI';
  const icon = isAI ? 'sparkles' : 'bar-chart-2';
  const iconType = isAI ? 'ai' : 'analytics';
  const initialIconBg = isAI ? 'bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400';

  return `
    <a href="${u.url}" target="_blank" class="nav-card">
      <div class="icon-box ${iconType} ${initialIconBg}">
        <i data-lucide="${icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 min-w-0 pr-6">
        <h4 class="card-title">${u.name}</h4>
        <p class="card-desc">${u.description}</p>
      </div>
      <i data-lucide="arrow-right" class="w-4 h-4 launch-arrow"></i>
    </a>
  `;
}

function render() {
  const term = searchTerm.toLowerCase();

  // Filter Data
  const filtered = utilities.filter(u => 
    u.name.toLowerCase().includes(term) || 
    u.description.toLowerCase().includes(term)
  );

  // Split by Type
  const aiTools = filtered.filter(u => u.type === 'AI');
  const analyticsTools = filtered.filter(u => u.type === 'Analytics');

  // Render Grids
  grids.ai.innerHTML = aiTools.map(getCardHTML).join('');
  grids.analytics.innerHTML = analyticsTools.map(getCardHTML).join('');

  // Update Counts
  counts.ai.textContent = `${aiTools.length} items`;
  counts.analytics.textContent = `${analyticsTools.length} items`;

  // Toggle Sections Visibility based on content
  sections.ai.style.display = aiTools.length > 0 ? 'block' : 'none';
  sections.analytics.style.display = analyticsTools.length > 0 ? 'block' : 'none';

  // Toggle Empty State
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    searchTermDisplay.textContent = searchTerm;
  } else {
    emptyState.classList.add('hidden');
  }

  lucide.createIcons();
}

// Search
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  render();
});

themeToggle.addEventListener('click', toggleTheme);

init();