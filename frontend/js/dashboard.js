// Dashboard JavaScript - Stock Analysis

let selectedMode = 'SWING';

function selectMode(mode) {
    selectedMode = mode;
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
}

function activateResultsSection() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.classList.add('active');
    }
}

async function analyzeStock() {
    const stockName = document.getElementById('stockInput').value.trim();
    const capital = document.getElementById('capitalInput').value;
    const riskPercent = document.getElementById('riskInput').value;
    const apiEndpoint = document.getElementById('apiEndpoint').value.trim();

    if (!stockName) {
        alert('Please enter a stock symbol or name');
        return;
    }

    if (!apiEndpoint) {
        alert('Please enter API endpoint URL');
        showApiSetup();
        return;
    }

    // Show loading
    showLoading();

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stockName,
                tradeMode: selectedMode,
                capital: parseFloat(capital),
                riskPercentage: parseFloat(riskPercent)
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            displayResults(result.data, result.positionSize);
            showToast('Analysis completed successfully!', 'success');
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Analysis error:', error);
        alert(`Error: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. API endpoint URL is correct\n3. OpenAI API key is configured\n\nSee browser console for details.`);
    } finally {
        hideLoading();
    }
}

function displayResults(data, positionSize) {
    activateResultsSection();
    
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Stock Header
    document.getElementById('stockName').textContent = data.stock;
    document.getElementById('tradeBadge').textContent = data.tradeType;
    document.getElementById('tradeBadge').className = `badge badge-${data.tradeType === 'SWING' ? 'success' : 'info'}`;
    
    const trendClass = data.trend === 'BULLISH' ? 'success' : data.trend === 'BEARISH' ? 'danger' : 'warning';
    document.getElementById('trendBadge').textContent = data.trend;
    document.getElementById('trendBadge').className = `badge badge-${trendClass}`;
    
    document.getElementById('timestamp').textContent = new Date().toLocaleString('en-IN');

    // Trade Details
    document.getElementById('entryPrice').textContent = data.entry;
    document.getElementById('target1').textContent = data.target1;
    document.getElementById('target2').textContent = data.target2;
    document.getElementById('stoploss').textContent = data.stoploss;

    // Trade Table
    const tableBody = document.getElementById('tradeTableBody');
    tableBody.innerHTML = `
        <tr>
            <td><strong>Risk:Reward Ratio</strong></td>
            <td><span class="badge badge-success">${data.riskReward}</span></td>
            <td>Potential reward vs risk</td>
        </tr>
        <tr>
            <td><strong>Entry Price</strong></td>
            <td>${data.entry}</td>
            <td>Recommended buy price</td>
        </tr>
        <tr>
            <td><strong>Target 1</strong></td>
            <td class="text-success">${data.target1}</td>
            <td>First profit booking level</td>
        </tr>
        <tr>
            <td><strong>Target 2</strong></td>
            <td class="text-success">${data.target2}</td>
            <td>Maximum profit target</td>
        </tr>
        <tr>
            <td><strong>Stop Loss</strong></td>
            <td class="text-danger">${data.stoploss}</td>
            <td>Maximum loss limit</td>
        </tr>
    `;

    // Confidence Meter
    const confidenceMap = { 'HIGH': 85, 'MEDIUM': 60, 'LOW': 35 };
    const confidencePercent = confidenceMap[data.confidence] || 50;
    document.getElementById('confidenceText').textContent = data.confidence;
    document.getElementById('confidenceFill').style.width = confidencePercent + '%';
    document.getElementById('confidencePercent').textContent = confidencePercent + '%';

    // Analysis Text
    document.getElementById('analysisText').textContent = data.analysis;

    // Indicators
    const indicatorTags = document.getElementById('indicatorTags');
    if (data.indicators && data.indicators !== 'N/A') {
        const indicators = data.indicators.split(',').map(i => i.trim());
        indicatorTags.innerHTML = indicators
            .map(ind => `<span class="indicator-tag">${ind}</span>`)
            .join('');
    } else {
        indicatorTags.innerHTML = '';
    }

    // Position Calculator
    const calcResult = document.getElementById('calcResult');
    if (positionSize) {
        calcResult.innerHTML = `
            <div class="calc-item">
                <div class="calc-item-label">Quantity</div>
                <div class="calc-item-value">${positionSize.quantity}</div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">Investment</div>
                <div class="calc-item-value">₹${positionSize.totalInvestment}</div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">Risk Amount</div>
                <div class="calc-item-value">₹${positionSize.riskAmount}</div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">Max Loss</div>
                <div class="calc-item-value text-danger">₹${positionSize.potentialLoss}</div>
            </div>
        `;
    } else {
        calcResult.innerHTML = '<p class="text-secondary">Position size calculation not available</p>';
    }
}

// Enter key to analyze
document.addEventListener('DOMContentLoaded', function() {
    const stockInput = document.getElementById('stockInput');
    if (stockInput) {
        stockInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeStock();
            }
        });
    }

    // Load saved API endpoint
    const savedEndpoint = Storage.get('apiEndpoint');
    if (savedEndpoint) {
        document.getElementById('apiEndpoint').value = savedEndpoint;
    }

    // Save API endpoint on change
    document.getElementById('apiEndpoint').addEventListener('change', function(e) {
        Storage.set('apiEndpoint', e.target.value);
    });

    // Hide results section initially
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
});