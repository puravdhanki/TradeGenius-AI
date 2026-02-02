// Configuration for TradeGenius AI
const Config = {
    // API Endpoints (defaults)
    endpoints: {
        analysis: 'http://localhost:3000/api/ai/analyze',
        chat: 'http://localhost:3000/api/ai/chat',
        admin: 'http://localhost:3000/api/admin/analytics'
    },
    
    // Default values
    defaults: {
        capital: 100000,
        riskPercent: 2,
        tradeMode: 'SWING'
    },
    
    // Quick stock symbols
    stocks: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'TATASTEEL'],
    
    // Initialize configuration
    init: function() {
        // Load saved endpoints
        const savedEndpoints = Storage.get('endpoints');
        if (savedEndpoints) {
            this.endpoints = { ...this.endpoints, ...savedEndpoints };
        }
        
        // Update form values
        this.updateForms();
    },
    
    // Update all form fields with saved values
    updateForms: function() {
        // Dashboard
        const apiEndpointInput = document.getElementById('apiEndpoint');
        if (apiEndpointInput) {
            apiEndpointInput.value = this.endpoints.analysis;
        }
        
        // AI Assistant
        const chatEndpointInput = document.getElementById('chatApiEndpoint');
        if (chatEndpointInput) {
            chatEndpointInput.value = this.endpoints.chat;
        }
        
        // Admin
        const adminEndpointInput = document.getElementById('adminApiEndpoint');
        if (adminEndpointInput) {
            adminEndpointInput.value = this.endpoints.admin;
        }
    },
    
    // Save configuration
    save: function() {
        Storage.set('endpoints', this.endpoints);
        Storage.set('defaults', this.defaults);
        this.updateForms();
        showToast('Configuration saved!', 'success');
    },
    
    // Reset to defaults
    reset: function() {
        this.endpoints = {
            analysis: 'http://localhost:3000/api/ai/analyze',
            chat: 'http://localhost:3000/api/ai/chat',
            admin: 'http://localhost:3000/api/admin/analytics'
        };
        this.save();
        showToast('Configuration reset to defaults!', 'info');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Config !== 'undefined') {
        Config.init();
    }
});