require('dotenv').config(); // dotenv를 가장 상단에 위치
const OpenAI = require('openai');
const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
});

// ChatGPT에 대화식으로 요청을 보내는 함수
async function  callChatGPT(message) {
    console.log("callChatGPT함수에서 사용자가 입력한 질문:", message)
    
    // gpt 한테 내부적으로 명령할 변수 선언
    let adminText = '대한민국의 장기요양서비스에 대해서 잘 알고 있는 상담사의 입장에서 대답해줘. ai 상담사니까 공손하게 한국어의 존댓말을 사용해서 대답해줘.';

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: adminText },
              { role: 'user', content: message },
            ],
          });

        // 모델의 응답에서 답변 가져오기
        const answer = response.choices[0].message.content;
        console.log('ChatGPT 답변:', answer);
        return answer; // 대답을 리턴

    } catch (error) { // 오류 잡기 
        console.error('ChatGPT 요청 중 오류:', error);
        throw error;
    }
}

module.exports = { callChatGPT };