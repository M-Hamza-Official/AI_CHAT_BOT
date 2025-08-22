let botIcon = document.querySelector('.bot-icon');
let container = document.querySelector('.container');
const chatBody = document.querySelector('.message-box');
const userInput = document.querySelector('.user-input');
const form = document.querySelector('form');

let chatData = {
    message:[]
}
//Gemini Api SetUp
const API_KEY = 'AIzaSyCpbw7LMLgs33JrDjYpuxWSt3Ff8ICFhQg'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

//getting Gemini Response
async function getBotResponse(){
const requestOptions = {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        role:'user',
        parts: [{ text: chatData.message[chatData.message.length -1] }] // join all user messages
      }
    ]
  })
};


try{
  const response = await fetch(API_URL,requestOptions);
  const data = await response.json();
  console.log(data);
  let geminiResponse =  data.candidates[0].content.parts[0].text
  // console.log(geminiResponse);
  
  botUiResponse(geminiResponse);
hideThinking();
    if(!response.ok) throw new Error(data.error.message)

}catch(error){
console.log(error);

}
}
// getBotResponse()




function addMessage(userMessage) {

    const template = document.getElementById('user-message-template');
    const messageElm = template.content.cloneNode(true);
    // console.log(messageElm);
    chatData.message.push(userMessage);
    messageElm.querySelector('.message-text').textContent = userMessage
    chatBody.appendChild(messageElm);
    // showThinking()
    showThinking()
setTimeout(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
}, 50);  

}


function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage);
    
    // showThinking()
    userInput.value = ""; // Clear input
    getBotResponse()
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
//Bot Thinking Icon Show
function showThinking(){
    const thinkingEl = document.createElement('div');
    thinkingEl.classList.add("bot-message", "flex", "gap-3", "items-start", "max-w-[90%]");
    thinkingEl.innerHTML = `
     <div class="min-w-[35px]">
      <img class="h-[35px] w-[35px] rounded-full p-1 bg-[#C8C7FF]" src="./logo.svg" alt="Bot Avatar">
    </div>
    <div class="bg-[#C8C7FF] rounded-tl-[13px] rounded-tr-[13px] rounded-br-[13px] rounded-bl-[3px] px-4 py-3 shadow-sm">
      <div class="thinking flex gap-2 items-center">
        <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
        <span class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
      </div>
    </div>
    `
  thinkingEl.setAttribute("id", "thinking-msg"); 
  chatBody.appendChild(thinkingEl)
setTimeout(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
}, 50);
}

function hideThinking(){
    const botThinking = document.getElementById('thinking-msg');
    if(botThinking) botThinking.remove();
}

function botUiResponse(geminires){
  const div = document.createElement('div')
  div.classList.add("bot-message", "flex", "gap-3", "items-start", "max-w-[90%]")
  div.innerHTML =`
   <div class="min-w-[35px]">
                            <img class="h-[35px] w-[35px] rounded-full p-1 bg-[#C8C7FF]" src="./logo.svg" alt="Bot Avatar">
                        </div>
                        <div class="bg-[#C8C7FF] rounded-tl-[13px] rounded-tr-[13px] rounded-br-[13px] rounded-bl-[3px] px-4 py-3 shadow-sm">
                            <p>${geminires}</p>
                        </div>
                    </div> 
  `
  chatBody.appendChild(div);
setTimeout(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
}, 50);}



// botIcon.addEventListener('click',()=>{

// container.classList.remove('hidden')
// botIcon.classList.add('hidden')
// // botIcon.

// })