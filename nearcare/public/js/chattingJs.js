
document.getElementById('chatForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userInput = document.getElementById('input_chat').value;
    if (userInput.trim() === '') return;

    // 사용자 입력을 화면에 표시
    const userMessages = document.getElementById('chatbotMessages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('div_chat_bubble_group_user');
    userMessageDiv.innerHTML = `
        <div class="div_chat_bubble_big_user">
            <span class="span_chat_bubble_text_user">${userInput}</span>
        </div>
    `;
    userMessages.appendChild(userMessageDiv);

    // 스크롤을 아래로 내리는 함수 호출 (수정된 부분)
    scrollToBottom();

    // 서버로 사용자 입력 전송
    try {
        const response = await fetch('/chatting/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInputText: userInput })
        });

        const data = await response.json();
        const chatbotMessages = document.getElementById('chatbotMessages');

        if (data.gptResponse) {
            // ChatGPT 응답을 화면에 표시
            const chatbotMessageDiv = document.createElement('div');
            chatbotMessageDiv.classList.add('div_chat_bubble_group_gpt');
            
            chatbotMessageDiv.innerHTML = `
                <div class="div_img_profile_chatbot_bg">
                    <img src="/images/profile_chatbot_icon.png" class="img_profile_chatbot_icon">
                </div>
                <div class="div_chat_bubble_big_gpt">
                    <span class="span_text_gpt"></span>
                </div>
            `;
            chatbotMessages.appendChild(chatbotMessageDiv);

            scrollToBottom();
            // 자영 타이핑 하는 효과 추가 
            const textElement = chatbotMessageDiv.querySelector('.span_text_gpt');

            let index = 0;

            function typeWriter() {
                if (index < data.gptResponse.length) {
                    textElement.innerHTML += data.gptResponse.charAt(index);
                    scrollToBottom();
                    index++;
                    setTimeout(typeWriter, 30); // 타이핑 속도 조절 (밀리초 단위)
                }
            }

            typeWriter();
        } else {
            console.error('ChatGPT 응답 없음');
        }
    } catch (error) {
        console.error('오류 발생:', error);
    }

    // 입력 필드 비우기
    document.getElementById('input_chat').value = '';
});


// 스크롤을 아래로 내리는 함수
function scrollToBottom() {
    const chatContainer = document.getElementById('chatbotMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 초기 로딩 시 스크롤을 가장 아래로 내림
document.addEventListener("DOMContentLoaded", function() {
    scrollToBottom();
});