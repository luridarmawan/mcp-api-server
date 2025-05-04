const socket = io();
const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function addMessage(message, sender) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = message;
  chatbox.appendChild(bubble);
  chatbox.scrollTop = chatbox.scrollHeight;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message === '') return;

  addMessage(message, 'user');
  socket.emit('userMessage', message);
  chatInput.value = '';
});

socket.on('botMessage', (message) => {
  addMessage(message, 'bot');
});