/* =====================================================
   ShowWork - Main Application Logic
   Handles UI interactions, mobile menu, forms, etc.
   ===================================================== */

// =====================================================
// Initialize Lucide Icons
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// =====================================================
// Mobile Menu
// =====================================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');

        if (isOpen) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });
}

// =====================================================
// Toast Notifications
// =====================================================
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = 'toast';

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    const colors = {
        success: 'text-emerald-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-violet-400'
    };

    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i data-lucide="${icons[type]}" class="w-5 h-5 ${colors[type]}"></i>
            <span class="text-slate-200">${message}</span>
            <button class="ml-4 text-slate-500 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    // Show animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

// =====================================================
// Form Validation
// =====================================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function validateGitHubURL(url) {
    return url.includes('github.com/');
}

// =====================================================
// Dropdown Handling
// =====================================================
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');

    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
    }
});

// Close dropdowns on outside click
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// =====================================================
// Modal Handling
// =====================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// =====================================================
// Search Functionality
// =====================================================
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchInput) {
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            if (searchResults) searchResults.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
}

async function performSearch(query) {
    // This will be implemented with Supabase
    console.log('Searching for:', query);

    // Placeholder search results
    const results = [
        { type: 'project', title: 'AI Chat Application', url: '/project/ai-chat' },
        { type: 'user', title: 'John Developer', url: '/profile/john' },
    ];

    displaySearchResults(results);
}

function displaySearchResults(results) {
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = '<p class="p-4 text-slate-500">No results found</p>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <a href="${result.url}" class="dropdown-item flex items-center gap-3">
                <i data-lucide="${result.type === 'project' ? 'folder' : 'user'}" class="w-4 h-4 text-slate-500"></i>
                ${result.title}
            </a>
        `).join('');
    }

    searchResults.classList.remove('hidden');
    lucide.createIcons();
}

// =====================================================
// Like/Save Actions
// =====================================================
async function toggleLike(projectId, button) {
    const isLiked = button.classList.contains('liked');

    // Optimistic update
    button.classList.toggle('liked');
    const countEl = button.querySelector('.like-count');
    if (countEl) {
        const currentCount = parseInt(countEl.textContent);
        countEl.textContent = isLiked ? currentCount - 1 : currentCount + 1;
    }

    // Animate
    if (!isLiked && window.ShowWorkAnimations) {
        window.ShowWorkAnimations.animateLike(button);
    }

    // API call will be implemented with Supabase
    console.log('Toggle like for project:', projectId);
}

async function toggleSave(projectId, button) {
    const isSaved = button.classList.contains('saved');

    // Optimistic update
    button.classList.toggle('saved');

    // API call will be implemented with Supabase
    console.log('Toggle save for project:', projectId);

    showToast(isSaved ? 'Removed from saved' : 'Saved to collection', 'success');
}

// =====================================================
// Image Upload Preview
// =====================================================
function handleImageUpload(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview || !input.files || !input.files[0]) return;

    const file = input.files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        input.value = '';
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// =====================================================
// Video Upload Preview
// =====================================================
function handleVideoUpload(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview || !input.files || !input.files[0]) return;

    const file = input.files[0];

    // Validate file type
    if (!file.type.startsWith('video/')) {
        showToast('Please select a video file', 'error');
        input.value = '';
        return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
        showToast('Video must be less than 100MB', 'error');
        input.value = '';
        return;
    }

    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.classList.remove('hidden');
}

// =====================================================
// Copy to Clipboard
// =====================================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// =====================================================
// Share Profile/Project
// =====================================================
async function shareLink(url, title) {
    if (navigator.share) {
        try {
            await navigator.share({ title, url });
        } catch (e) {
            if (e.name !== 'AbortError') {
                copyToClipboard(url);
            }
        }
    } else {
        copyToClipboard(url);
    }
}

// =====================================================
// Theme Toggle (Future)
// =====================================================
function toggleTheme() {
    // For future light mode support
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme',
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
}

// =====================================================
// Skeleton Loading
// =====================================================
function showSkeletons(container, count = 6) {
    const skeletonHTML = `
        <div class="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div class="aspect-video skeleton"></div>
            <div class="p-4 space-y-3">
                <div class="h-6 skeleton rounded w-3/4"></div>
                <div class="h-4 skeleton rounded w-1/2"></div>
                <div class="flex gap-2">
                    <div class="h-6 w-16 skeleton rounded-full"></div>
                    <div class="h-6 w-16 skeleton rounded-full"></div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = Array(count).fill(skeletonHTML).join('');
}

// =====================================================
// Infinite Scroll
// =====================================================
function initInfiniteScroll(containerSelector, loadMore) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadMore();
            }
        });
    }, { rootMargin: '200px' });

    // Create sentinel element
    const sentinel = document.createElement('div');
    sentinel.className = 'scroll-sentinel';
    container.appendChild(sentinel);
    observer.observe(sentinel);
}

// =====================================================
// Export utilities
// =====================================================
window.ShowWork = {
    showToast,
    validateEmail,
    validatePassword,
    validateURL,
    validateGitHubURL,
    openModal,
    closeModal,
    toggleLike,
    toggleSave,
    handleImageUpload,
    handleVideoUpload,
    copyToClipboard,
    shareLink,
    showSkeletons,
    initInfiniteScroll
};
