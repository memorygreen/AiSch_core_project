require('dotenv').config(); // dotenv를 가장 상단에 위치
const OpenAI = require('openai');
const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
});
const fs = require('fs');

const file_md = '../nearcare/public/md/nearecare_prompt.md'; // 절대 경로 또는 상대 경로 지정
let prompt_text = '';

// 동기식으로 마크다운 파일 읽기
try {
    prompt_text = fs.readFileSync(file_md, { encoding: 'utf-8', flag: 'r' });
    // console.log("md 파일 내용 확인:", prompt_text); // 프로젝트 서버 연결 시 맨처음 읽어옴
} catch (err) {
    console.error('Error reading the file:', err);
}


// ChatGPT에 대화식으로 요청을 보내는 함수
async function  callChatGPT(message) {
    console.log("callChatGPT함수에서 사용자가 입력한 질문:", message)
    

    // gpt 한테 내부적으로 명령할 변수 선언
    // let adminText = '대한민국의 장기요양서비스에 대해서 잘 알고 있는 상담사의 입장에서 대답해줘. ai 상담사니까 공손하게 한국어의 존댓말을 사용해서 대답해줘.';

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
            //   { role: 'system', content: adminText },
              { role: 'system', content: prompt_text },
              { role: 'user', content: prompt_text },
            ],
            max_tokens: 400 // 응답의 최대 토큰 수 설정 // 1토큰 == 한국어 약 4글자
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