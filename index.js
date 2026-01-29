
import { fetchUtilities } from './csvParser.js';

// State
let utilities = [];
let searchTerm = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');
const aiSection = document.getElementById('ai-section');
const aiGrid = document.getElementById('ai-grid');
const aiCount = document.getElementById('ai-count');
const aiEmpty = document.getElementById('ai-empty');

const analyticsSection = document.getElementById('analytics-section');
const analyticsGrid = document.getElementById('analytics-grid');
const analyticsCount = document.getElementById('analytics-count');
const analyticsEmpty = document.getElementById('analytics-empty');

const globalEmpty = document.getElementById('global-empty');
const clearSearchBtn = document.getElementById('clear-search-btn');
const yearSpan = document.getElementById('year');
const themeToggle = document.getElementById('theme-toggle');

// Theme Logic
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialization
async function init() {
  initTheme();
  yearSpan.textContent = new Date().getFullYear();
  lucide.createIcons(); // For static icons in HTML
  
  try {
    utilities = await fetchUtilities();
    render();
    
    // Smooth transition
    loader.classList.add('hidden');
    mainContent.classList.remove('hidden');
    mainContent.classList.add('animate-in', 'fade-in', 'duration-500');
  } catch (err) {
    console.error("Failed to load utilities", err);
    loader.innerHTML = `<p class="text-red-500">Failed to load data.</p>`;
  }
}

// Card Template
function createUtilityCard(utility) {
  const isAI = utility.type === 'AI';
  
  // Dynamic styles based on type
  // Light mode accents
  const lightBorder = isAI ? 'border-indigo-100 hover:border-indigo-400' : 'border-teal-100 hover:border-teal-400';
  const lightIconBg = isAI ? 'bg-violet-50' : 'bg-teal-50';
  const lightTag = isAI ? 'bg-violet-100 text-indigo-700' : 'bg-teal-100 text-teal-700';
  const lightIconColor = isAI ? 'text-indigo-600' : 'text-teal-600';
  const lightTitleHover = 'group-hover:text-indigo-600';

  // Dark mode accents
  const darkBorder = isAI ? 'dark:border-indigo-900/40 dark:hover:border-indigo-500/60' : 'dark:border-teal-900/40 dark:hover:border-teal-500/60';
  const darkIconBg = isAI ? 'dark:bg-indigo-900/30' : 'dark:bg-teal-900/30';
  const darkTag = isAI ? 'dark:bg-indigo-900/50 dark:text-indigo-300' : 'dark:bg-teal-900/50 dark:text-teal-300';
  const darkIconColor = isAI ? 'dark:text-indigo-400' : 'dark:text-teal-400';
  const darkTitleHover = 'dark:group-hover:text-indigo-400';

  const iconName = isAI ? 'brain' : 'network';

  return `
    <a href="${utility.url}" target="_blank" rel="noopener noreferrer"
       class="group block p-6 bg-white dark:bg-slate-900 border-2 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-none dark:hover:bg-slate-800 ${lightBorder} ${darkBorder} border-slate-100 dark:border-slate-800">
      <div class="flex items-start justify-between">
        <div class="p-3 rounded-xl ${lightIconBg} ${darkIconBg}">
          <i data-lucide="${iconName}" class="w-6 h-6 ${lightIconColor} ${darkIconColor}"></i>
        </div>
        <i data-lucide="arrow-up-right" class="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors"></i>
      </div>
      <div class="mt-5">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 ${lightTitleHover} ${darkTitleHover} transition-colors">
          ${utility.name}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          ${utility.description}
        </p>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <span class="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md ${lightTag} ${darkTag}">
          ${utility.type}
        </span>
      </div>
    </a>
  `;
}

// Render Logic
function render() {
  const term = searchTerm.toLowerCase();
  const filtered = utilities.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  );

  const aiItems = filtered.filter(i => i.type === 'AI');
  const analyticsItems = filtered.filter(i => i.type === 'Analytics');

  // Render AI Section
  aiGrid.innerHTML = aiItems.map(createUtilityCard).join('');
  aiCount.textContent = `${aiItems.length} Tools`;
  
  if (aiItems.length === 0) {
    aiEmpty.classList.remove('hidden');
  } else {
    aiEmpty.classList.add('hidden');
  }

  // Render Analytics Section
  analyticsGrid.innerHTML = analyticsItems.map(createUtilityCard).join('');
  analyticsCount.textContent = `${analyticsItems.length} Tools`;
  
  if (analyticsItems.length === 0) {
    analyticsEmpty.classList.remove('hidden');
  } else {
    analyticsEmpty.classList.add('hidden');
  }

  // Section Visibility
  aiSection.className = `transition-all duration-300 ${aiItems.length === 0 ? 'opacity-40 grayscale pointer-events-none hidden lg:block' : ''}`;
  analyticsSection.className = `transition-all duration-300 ${analyticsItems.length === 0 ? 'opacity-40 grayscale pointer-events-none hidden lg:block' : ''}`;

  // Global Empty State
  if (filtered.length === 0) {
    globalEmpty.classList.remove('hidden');
    aiSection.classList.add('hidden');
    analyticsSection.classList.add('hidden');
  } else {
    globalEmpty.classList.add('hidden');
  }

  // Refresh Icons
  lucide.createIcons();
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  render();
});

clearSearchBtn.addEventListener('click', () => {
  searchTerm = '';
  searchInput.value = '';
  render();
});

themeToggle.addEventListener('click', () => {
  toggleTheme();
});

// Start
init();
