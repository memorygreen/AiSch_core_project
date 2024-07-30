const https = require('https');

function sendKakaoMessage(userId, message) {
    const options = {
        hostname: 'kapi.kakao.com',
        path: '/v2/api/talk/memo/default/send',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.KAKAO_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    const postData = `template_object=${encodeURIComponent(JSON.stringify({
        object_type: 'text',
        text: message,
        link: {
            web_url: 'http://localhost:3098',
            mobile_web_url: 'http://localhost:3098',
        },
    }))}`;

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsedData = JSON.parse(data);
                        if (parsedData.result_code === 0) {
                            resolve(parsedData);
                        } else {
                            reject(new Error(`Kakao API Error: ${parsedData.result_message}`));
                        }
                    } catch (error) {
                        reject(new Error('Error parsing Kakao API response'));
                    }
                } else {
                    reject(new Error(`Request failed. Status code: ${res.statusCode}, Response: ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

module.exports = sendKakaoMessage;
