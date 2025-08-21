let botIcon = document.querySelector('.bot-icon')
let container = document.querySelector('.container')
const chatBody = document.querySelector('.message-box')
const userInput = document.querySelector('.user-input');
const form = document.querySelector('form')
function addMessage(userMessage) {
    const template = document.getElementById('user-message-template');
    const messageElm = template.content.cloneNode(true);
    console.log(messageElm);
    
    messageElm.querySelector('.message-text').textContent = userMessage
    chatBody.appendChild(messageElm);
    chatBody.scrollTop = chatBody.scrollHeight;


}


function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage);
    userInput.value = ""; // Clear input
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
});

form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // stop new line
        sendMessage();
    }
});







// botIcon.addEventListener('click',()=>{

// container.classList.remove('hidden')
// botIcon.classList.add('hidden')
// // botIcon.

// })