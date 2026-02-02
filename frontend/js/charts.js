// Charts JavaScript - TradingView Integration

let widget;
let currentSymbol = 'NSE:NIFTY';
let currentInterval = 'D';
let currentChartType = 1;

function initChart() {
    widget = new TradingView.widget({
        "width": "100%",
        "height": 600,
        "symbol": currentSymbol,
        "interval": currentInterval,
        "timezone": "Asia/Kolkata",
        "theme": "dark",
        "style": currentChartType.toString(),
        "locale": "in",
        "toolbar_bg": "#1e2746",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": true,
        "container_id": "tradingview-chart",
        "studies": [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "MASimple@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650"
    });
}

function loadChart() {
    const symbolInput = document.getElementById('symbolInput').value.trim().toUpperCase();
    if (symbolInput) {
        currentSymbol = symbolInput.startsWith('NSE:') ? symbolInput : 'NSE:' + symbolInput;
        document.getElementById('currentSymbol').textContent = symbolInput.replace('NSE:', '');
        
        // Remove old widget
        document.getElementById('tradingview-chart').innerHTML = '';
        
        // Initialize new widget
        initChart();
    }
}

function quickLoad(symbol) {
    currentSymbol = symbol;
    const displaySymbol = symbol.replace('NSE:', '');
    document.getElementById('symbolInput').value = displaySymbol;
    document.getElementById('currentSymbol').textContent = displaySymbol;
    
    // Remove old widget
    document.getElementById('tradingview-chart').innerHTML = '';
    
    // Initialize new widget
    initChart();
}

function changeInterval(interval) {
    currentInterval = interval;
    
    const intervalNames = {
        '1': '1 Min',
        '5': '5 Min',
        '15': '15 Min',
        '60': '1 Hour',
        'D': 'Daily',
        'W': 'Weekly',
        'M': 'Monthly'
    };
    
    document.getElementById('currentInterval').textContent = intervalNames[interval];
    
    // Update active button
    const buttons = document.querySelectorAll('.control-group:first-of-type .control-btn');
    buttons.forEach(btn => {
        const btnText = btn.textContent.trim();
        if (intervalNames[interval] === btnText) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Reload chart
    document.getElementById('tradingview-chart').innerHTML = '';
    initChart();
}

function changeChartType(type) {
    currentChartType = parseInt(type);
    
    const typeNames = {
        '0': 'Bars',
        '1': 'Candles',
        '3': 'Line',
        '8': 'Heikin Ashi'
    };
    
    document.getElementById('currentChartType').textContent = typeNames[type];
    
    // Update active button
    const buttons = document.querySelectorAll('.control-group:nth-of-type(2) .control-btn');
    buttons.forEach(btn => {
        if (btn.textContent === typeNames[type]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Reload chart
    document.getElementById('tradingview-chart').innerHTML = '';
    initChart();
}

// Initialize chart on page load
window.addEventListener('load', function() {
    // Wait for TradingView library to load
    if (typeof TradingView !== 'undefined') {
        initChart();
    } else {
        console.error('TradingView library not loaded');
    }
});

// Enter key to load chart
document.addEventListener('DOMContentLoaded', function() {
    const symbolInput = document.getElementById('symbolInput');
    if (symbolInput) {
        symbolInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadChart();
            }
        });
    }
});