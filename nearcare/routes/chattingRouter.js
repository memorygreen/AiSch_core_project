const express = require('express');
const router = express.Router();
const conn = require('../config/db'); // db 연결
const { callChatGPT } = require('../public/js/chatgpt'); // chat gpt api 함수 연결
const bodyParser = require('body-parser'); // body-parser 추가


router.use(bodyParser.json()); // JSON 데이터 파싱 설정
router.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 데이터 파싱 설정


// '/chatting'으로 요청이 들어왔을 때 실행될 것
router.get('/', (req,res)=>{
    res.render('chatting');

});


// '/chatting/send'로 요청이 들어왔을 때 실행될 것
router.post('/send', async (req,res)=>{ // async 추가

    let promptText = req.body.userInputText; // chatting.html의 input태그에 있는 값 받아오기
    console.log('Received user input(promptText):', promptText);// 데이터 수신 확인을 위한 로그 추가

    // ChatGPT에 대화식으로 요청 보내기
    const postText = promptText; // 예시 텍스트
    console.log("질문내용(postText):", postText)
    

    // 질문 내용 4천자 이상인지 확인, 4000자 초과 시 4000자로 잘라서 보내기
    let message = postText.length > 4000 ? postText.substring(0, 4000) : postText;
    
    // 질문 내용을 db에 저장하기(채팅방 idx 새로 생성, 해당 채팅방에 맞게 채팅내용 insert)

     try {

      // 초기 요청을 ChatGPT에 보냄.
      // chat gpt api 함수 호출
         let gptResponse = await callChatGPT(message); // 대답을 받아올때까지 기다림 
          if (gptResponse) {
            console.log('ChatGPT API 응답: ' + gptResponse);
            
            // 응답을 클라이언트에 전달
            res.json({ gptResponse: gptResponse });

            // html 에 전달
            
            // 사용자 질문과 ChatGPT 응답을 데이터베이스에 저장
            // const query = 'INSERT INTO chat_log (user_message, gpt_response) VALUES (?, ?)';
            // conn.query(query, [message, gptResponse], (err, result) => {
            //     if (err) {
            //         console.error('데이터베이스에 저장 중 오류:', err);
            //     } else {
            //         console.log('채팅 내용이 데이터베이스에 저장되었습니다.');
            //     }
            // });

          } else {
            console.log('ChatGPT API 응답 실패!');
            res.status(500).json({ error: 'Failed to get response from ChatGPT API' });

          }

    } catch (error) {
        console.error('ChatGPT 요청 중 오류:', error);
        res.status(500).json({ error: 'ChatGPT 요청 중 오류 발생' });

    }

});




module.exports = router;