const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const historyList = document.getElementById('history-list');

// Store conversation history
let history = [];

// Send message
sendBtn.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';

  // Add user message to history
  history.push({ role: 'user', content: message });

  try {
    // Show loading dots while waiting
    showThinkingDots();

    // UPDATED: Points directly to your live Render backend URL instead of localhost
    const response = await fetch('https://chatbot-8jke.onrender.com/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message, history })
    });

    const data = await response.json();
    const reply = data.reply || 'No response from AI.';

    // Remove loading dots
    removeThinkingDots();

    // Add AI reply to history
    history.push({ role: 'assistant', content: reply });

    addTypingEffect(reply, 'bot');
    updateHistory();
  } catch (error) {
    console.error(error);
    removeThinkingDots();
    addMessage('Sorry, something went wrong connecting to the server.', 'bot');
  }
});

// Add message to chat box
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing animation for AI replies
function addTypingEffect(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  chatBox.appendChild(msgDiv);

  let i = 0;
  const interval = setInterval(() => {
    msgDiv.textContent = text.slice(0, i);
    i++;
    if (i > text.length) clearInterval(interval);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 30);
}

// Show “thinking dots” while AI is generating
function showThinkingDots() {
  const dotsDiv = document.createElement('div');
  dotsDiv.classList.add('message', 'bot');
  dotsDiv.id = 'thinking-dots';
  dotsDiv.textContent = '...';
  chatBox.appendChild(dotsDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingDots() {
  const dotsDiv = document.getElementById('thinking-dots');
  if (dotsDiv) dotsDiv.remove();
}

// Update sidebar history
function updateHistory() {
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    if (item.role === 'user') {
      const li = document.createElement('li');
      li.textContent = item.content.slice(0, 40);
      li.addEventListener('click', () => {
        chatBox.innerHTML = '';
        history.slice(0, index + 1).forEach(msg =>
          addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot')
        );
      });
      historyList.appendChild(li);
    }
  });
}