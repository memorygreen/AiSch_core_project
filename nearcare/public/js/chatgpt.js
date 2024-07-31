require('dotenv').config(); // dotenv를 가장 상단에 위치
const OpenAI = require('openai');
const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
});
const fs = require('fs');

const file_md = '../nearcare/public/md/nearecare_prompt.md'; // 절대 경로 또는 상대 경로 지정
let prompt_text = '';

// 동기식으로 마크다운 파일 읽기
// try {
//     prompt_text = fs.readFileSync(file_md, { encoding: 'utf-8', flag: 'r' });
//     // console.log("md 파일 내용 확인:", prompt_text); // 프로젝트 서버 연결 시 맨처음 읽어옴
// } catch (err) {
//     console.error('Error reading the file:', err);
// }


// ChatGPT에 대화식으로 요청을 보내는 함수
async function  callChatGPT(message) { // flaskResponse => json 형태
    console.log("callChatGPT함수 입력받은 json 값 :", message)
    

    // gpt 한테 내부적으로 명령할 변수 선언
    let adminText = '당신의 역할은 대한민국의 장기요양서비스를 잘 알고있으면서 질문하는 요양대상자의 상황 및 상태 등에 맞게 현재 대한민국에서 시행중인 장기요양서비스를 추천해주는 상담사 입니다.  사용자가 자신의 나이, 성별, 증상, 장기요양등급을 포함한 문장을 json 형태로 제공하면 이에 맞는 응답은 텍스트 형식으로 제공되어야 합니다. ';


    prompt_text = "어머니께서 가사일이나 집밖의 활동을 할 때 다른 사람의 도움을 받아야 하는 상태로 예상됩니다. 이런 경우 재가급여 중 방문요양을 추천드립니다. 방문요양은 요양보호사가 집으로 방문하여 신체 활동 및 가사활동 등을 지원하는 장기요양급여로, 3등급의 경우에도 지원을 받을 수 있습니다. 추가로 궁금한 사항이 있다면 언제든지 질문해주세요.😊"    
    return prompt_text
    // try {
    //     const response = await openai.chat.completions.create({
    //         model: 'gpt-3.5-turbo',
    //         messages: [
    //         //   { role: 'system', content: adminText },
    //           { role: 'system', content: adminText },
    //           { role: 'user', content: prompt_text },
    //         ],
    //         max_tokens: 400 // 응답의 최대 토큰 수 설정 // 1토큰 == 한국어 약 4글자
    //       });

    //     // 모델의 응답에서 답변 가져오기
    //     const answer = response.choices[0].message.content;
    //     console.log('ChatGPT 답변:', answer);
    //     return answer; // 대답을 리턴

    // } catch (error) { // 오류 잡기 
    //     console.error('ChatGPT 요청 중 오류:', error);
    //     throw error;
    // }
}

module.exports = { callChatGPT };