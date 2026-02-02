// AI Assistant JavaScript - Chat Interface

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const connectionStatus = document.getElementById('connectionStatus');
let conversationHistory = [];

// Set welcome message time
document.addEventListener('DOMContentLoaded', function() {
    const welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        welcomeTime.textContent = getTimeOnly();
    }
    
    // Load saved API endpoint
    const savedEndpoint = Storage.get('chatApiEndpoint');
    if (savedEndpoint) {
        document.getElementById('chatApiEndpoint').value = savedEndpoint;
    }
    
    // Save API endpoint on change
    const endpointInput = document.getElementById('chatApiEndpoint');
    if (endpointInput) {
        endpointInput.addEventListener('change', function(e) {
            Storage.set('chatApiEndpoint', e.target.value);
        });
    }
    
    // Check connection
    checkConnection();
    
    // Focus input
    if (chatInput) {
        chatInput.focus();
    }
    
    // Initialize typing indicator - hide by default
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
});

async function checkConnection() {
    const apiEndpoint = document.getElementById('chatApiEndpoint').value;
    // Just update status, actual connection check will happen on first message
    connectionStatus.textContent = 'Ready';
}

async function sendMessage() {
    const message = chatInput.value.trim();
    const apiEndpoint = document.getElementById('chatApiEndpoint').value.trim();
    
    if (!message) return;
    
    if (!apiEndpoint) {
        alert('Please enter API endpoint URL');
        return;
    }

    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show typing indicator
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
    }
    scrollToBottom();

    // Disable send button
    sendButton.disabled = true;
    connectionStatus.textContent = 'Sending...';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Hide typing indicator
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        connectionStatus.textContent = 'Online';

        if (result.success) {
            // Add AI response
            addMessage('ai', result.message);
            
            // Update conversation history
            conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: result.message }
            );

            // Keep only last 20 messages
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }
        } else {
            throw new Error(result.error || 'Chat failed');
        }
    } catch (error) {
        console.error('Chat error:', error);
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
        connectionStatus.textContent = 'Error';
        addMessage('ai', `❌ Error: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. API endpoint URL is correct\n3. OpenAI API key is configured`);
    } finally {
        sendButton.disabled = false;
    }
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = getTimeOnly();

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${type === 'ai' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <div>${text.replace(/\n/g, '<br>')}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    // Insert before typing indicator
    chatMessages.insertBefore(messageDiv, chatMessages.lastElementChild);
    scrollToBottom();
}

function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function quickAnalyze(stock) {
    chatInput.value = `Analyze ${stock} for swing trading`;
    sendMessage();
}

function askExample(question) {
    chatInput.value = question;
    sendMessage();
}

function clearChat() {
    if (confirm('Clear all chat messages?')) {
        // Keep only welcome message and typing indicator
        const messages = chatMessages.querySelectorAll('.message');
        messages.forEach((msg, index) => {
            if (index > 0 && index < messages.length - 1) {
                msg.remove();
            }
        });
        conversationHistory = [];
        showToast('Chat cleared', 'info');
    }
}

// Enter to send (Shift+Enter for new line)
if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Initialize typing indicator - hide by default
if (typingIndicator) {
    typingIndicator.style.display = 'none';
}

