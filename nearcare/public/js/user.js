// 회원가입 라디오버튼 클릭시 이벤트함수
let radioBtn = document.querySelectorAll('input[name="user_type"]');
radioBtn.forEach(function(radio){
    radio.addEventListener('change',function(){
        let selectOption = document.querySelector('input[name="user_type"]:checked').value;
        console.log('selectOption',selectOption);
        let centerDiv = document.querySelectorAll('.center_info');
        let userDiv = document.querySelectorAll('.join_user_info');
        if(selectOption == 'center'){
            centerDiv.forEach(function(element){
                element.style.display = 'flex';
            });
            userDiv.forEach(function(element){
                element.style.display = 'none';
            });
        }else{
            centerDiv.forEach(function(element){
                element.style.display = 'none';
            });
            userDiv.forEach(function(element){
                element.style.display = 'flex';
            });
        };
    });
});

document.getElementById('login-form').addEventListener('submit', function(e){
    e.preventDefault(); // 폼 제출 막기
    const userId = document.getElementById('userId').value;
    const userPw = document.getElementById('userPw').value;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    fetch('/user/loginPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken // 토큰 전달
        },
        body: JSON.stringify({ userId, userPw })
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        if(data.success){
            console.log('Success:', data);
            window.location.href = '/'; // 로그인 성공 후 메인 페이지로 이동
        }else{
            console.error('로그인 에러..', data.message);
        }

    })
    .catch(error => {
        console.error('로그인 마지막단 에러:', error);
    });
});


