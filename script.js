let botIcon = document.querySelector('.bot-icon');
let container = document.querySelector('.container');
const chatBody = document.querySelector('.message-box');
const userInput = document.querySelector('.user-input');
const form = document.querySelector('form');
const chatmainBody = document.querySelector('.botBody');
const fileInput = document.querySelector('#file-upload');
const inputButton = document.querySelector('.input-button');
const previewContainer = document.getElementById('form-preview');




let chatData = {
  message: [],
  file: {}
}
console.log(chatData);

//Gemini Api SetUp
const API_KEY = 'AIzaSyCpbw7LMLgs33JrDjYpuxWSt3Ff8ICFhQg';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const chatHistory = []


//getting Gemini Response
async function getBotResponse() {
  const requestOptions = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chatHistory
    })
  };


  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    console.log(data);
    // Extract response text
    let rawResponse = data.candidates[0].content.parts[0].text;
    formatGeminiResponse(rawResponse)
    // Clean the response by removing unwanted symbols and normalizing spaces
    let geminiResponse = formatGeminiResponse(rawResponse);
    chatHistory.push(
        {
          role: 'model',
          parts: [{ text:geminiResponse }
          ] // join all user messages
        }
      )

    let parsedResponse = marked.parse(geminiResponse)

    botUiResponse(parsedResponse);
    hideThinking();

  } catch (error) {
    console.log(error);

    botUiResponse(error.message || 'Something went wrong', true)
    hideThinking()
  }
}



userInput.addEventListener('input', function () {
  this.style.height = 'auto'; // reset height
  this.style.height = this.scrollHeight + 'px'; // set new height
});

function fileUploadHandler() {
  inputButton.addEventListener('click', fileInput.click());
  fileInput.addEventListener('change', () => {
    let file = fileInput.files[0];
    if (!file) return;
    console.log(chatData);
    //way to read file
    let reader = new FileReader;
    reader.onload = (e) => {
      const Base64Str = e.target.result.split(',')[1];
      chatData.file = {
        data: Base64Str,
        mime_type: file.type
      }

  previewContainer.innerHTML = ''; // only one image at a time
      const previewBox = document.createElement('div');
      previewBox.className = "relative";

      const img = document.createElement('img');
      img.src = e.target.result; // direct data URL
      img.className = "h-20 w-20 object-cover rounded border";

      const removeBtn = document.createElement('button');
      removeBtn.type = "button";
      removeBtn.innerHTML = "✕";
      removeBtn.className = "absolute top-0 right-0 bg-red-500 p-2 text-white rounded-full w-5 h-5 flex items-center justify-center";
      removeBtn.onclick = () => {
        chatData.file = {};        // clear stored file
        previewContainer.innerHTML = ''; // clear preview
      };

      previewBox.appendChild(img);
      previewBox.appendChild(removeBtn);
      previewContainer.appendChild(previewBox);


    }




    //converts it to Base64 string
    reader.readAsDataURL(file);
    fileInput.value ='';
  })
}
fileUploadHandler();


function addMessage(userMessage) {

  const template = document.getElementById('user-message-template');
  const messageElm = template.content.cloneNode(true);
  // console.log(messageElm);
  chatData.message.push(userMessage);

  if(chatData.file && chatData.file.data){
  let fileImagePR = document.createElement('div')
  fileImagePR.classList.add('attachment');
 let image = document.createElement('img');

  image.src = `data:${chatData.file.mime_type};base64,${chatData.file.data}`
  fileImagePR.appendChild(image);

  messageElm.querySelector('.image-preview-wrapper').appendChild(fileImagePR);

  }
  messageElm.querySelector('.message-text').textContent = userMessage;

  chatBody.appendChild(messageElm);
  // chatData.file = {}
  showThinking();
  scrollToBottom();


}

//ToDo---------
//            ----------|

function formatGeminiResponse(rawResponse) {
  // Replace triple backticks with <pre><code>
  return rawResponse.replace(/```(\w+)?([\s\S]*?)```/g, (match, lang, code) => {
    // Escape HTML characters inside code
    let escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang || "plaintext"}">${escapedCode.trim()}</code></pre>`;
  });
}


function scrollToBottom() {
  requestAnimationFrame(() => {
    chatmainBody.scrollTo({
      top: chatmainBody.scrollHeight,
      behavior: "smooth"
    });
  });
}


function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage);
  chatHistory.push(
        {
          role: 'user',
          parts: [{ text: chatData.message[chatData.message.length - 1] },

          ...(chatData.file.data ? [{ inline_data: chatData.file }] : [])
          ] // join all user messages
        }
      )

  // showThinking()
  userInput.value = ""; // Clear input
  previewContainer.innerHTML = '';
  chatData.file = {

  }
  getBotResponse();
  scrollToBottom();
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
function showThinking() {
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
  chatBody.appendChild(thinkingEl);
  scrollToBottom();

}

function hideThinking() {
  const botThinking = document.getElementById('thinking-msg');
  if (botThinking) botThinking.remove();
}

function botUiResponse(geminires, isError = false) {
  const div = document.createElement('div');
  div.classList.add("bot-message", "flex", "gap-3", "items-start", "max-w-[90%]")
  const bubbleColor = isError ? "bg-red-200 text-red-800" : "bg-[#E8E7FF]";

  div.innerHTML = `
   <div class="min-w-[35px]">
                            <img class="h-[35px] w-[35px] rounded-full p-1  bg-[#C8C7FF]" src="./logo.svg" alt="Bot Avatar">
                        </div>
                        <div class="${bubbleColor} rounded-tl-[13px] prose prose-sm max-w-none rounded-tr-[13px] rounded-br-[13px] rounded-bl-[3px] px-4 py-3 shadow-sm">
<div class="message-text"></div>
                        </div>
                    </div> 
  `
  div.querySelector('.message-text').innerHTML = geminires
  chatBody.appendChild(div);
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });

  scrollToBottom();

}



// botIcon.addEventListener('click',()=>{

// container.classList.remove('hidden')
// botIcon.classList.add('hidden')
// // botIcon.

// })