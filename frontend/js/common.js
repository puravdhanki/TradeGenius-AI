// Common JavaScript functions for all pages

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.classList.toggle('active');
}

// Highlight active nav link
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Show API setup modal
function showApiSetup() {
    const modal = document.getElementById('apiSetupModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Close API setup modal
function closeApiSetup() {
    const modal = document.getElementById('apiSetupModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('apiSetupModal');
    if (modal && event.target == modal) {
        modal.classList.remove('active');
    }
}

// Utility function to show loading overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Utility function to hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Format currency in INR
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Get current timestamp
function getTimestamp() {
    return new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Get time only
function getTimeOnly() {
    return new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Display toast notification (simple version)
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        z-index: 10000;
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Check if API endpoint is reachable
async function checkAPIConnection(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, {
            signal: controller.signal,
            method: 'GET',
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.error('API connection check failed:', error);
        return false;
    }
}

// Local storage helpers
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        showApiSetup,
        closeApiSetup,
        showLoading,
        hideLoading,
        formatINR,
        formatNumber,
        getTimestamp,
        getTimeOnly,
        copyToClipboard,
        showToast,
        scrollToElement,
        checkAPIConnection,
        Storage
    };
}

// Add this to common.js (append at the end)

// Add CSS animations for toast
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .indicator-tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: rgba(79, 70, 229, 0.2);
            color: var(--primary);
            border-radius: var(--radius-sm);
            font-size: 0.85rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            border: 1px solid rgba(79, 70, 229, 0.3);
        }
        
        .calc-item {
            background: var(--bg-tertiary);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            text-align: center;
        }
        
        .calc-item-label {
            color: var(--text-secondary);
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
        }
        
        .calc-item-value {
            font-family: 'Orbitron', monospace;
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(style);
}

// Enhanced toast function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Set toast color based on type
    const colors = {
        'success': 'var(--success)',
        'error': 'var(--danger)',
        'warning': 'var(--warning)',
        'info': 'var(--info)'
    };
    
    const icon = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icon[type]}" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border-left: 4px solid ${colors[type] || colors.info};
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        z-index: 10000;
        box-shadow: var(--shadow-lg);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        max-width: 400px;
        word-break: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Form validation utility
const Validator = {
    required: (value) => value && value.toString().trim().length > 0,
    number: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    min: (value, min) => parseFloat(value) >= min,
    max: (value, max) => parseFloat(value) <= max,
    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    
    validateForm: function(formId, rules) {
        const form = document.getElementById(formId);
        if (!form) return { valid: false, errors: ['Form not found'] };
        
        const errors = [];
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const input = form.querySelector(`#${field}`);
            if (!input) continue;
            
            const value = input.value;
            
            for (const [rule, param] of Object.entries(fieldRules)) {
                let isValid = true;
                
                switch (rule) {
                    case 'required':
                        isValid = this.required(value);
                        if (!isValid) errors.push(`${input.labels[0]?.textContent || field} is required`);
                        break;
                        
                    case 'number':
                        isValid = this.number(value);
                        if (!isValid) errors.push(`${input.labels[0]?.textContent || field} must be a number`);
                        break;
                        
                    case 'min':
                        isValid = this.min(value, param);
                        if (!isValid) errors.push(`${input.labels[0]?.textContent || field} must be at least ${param}`);
                        break;
                        
                    case 'max':
                        isValid = this.max(value, param);
                        if (!isValid) errors.push(`${input.labels[0]?.textContent || field} must be at most ${param}`);
                        break;
                        
                    case 'url':
                        isValid = this.url(value);
                        if (!isValid) errors.push(`${input.labels[0]?.textContent || field} must be a valid URL`);
                        break;
                }
                
                if (!isValid) break;
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
};