document.getElementById('care_recv_regi_form').addEventListener('submit', function(e) {
    e.preventDefault(); // 기본 form 제출 동작을 막음

        const form = new FormData(this);

        // 체크박스 값을 수집하여 배열로 변환
        // 모든 질환 타입 수집
        const allDiseaseTypes = ['dementia', 'dialusis', 'rehabiltation', 'cancer', 'meal', 'behavior', 'evacuation'];
        const diseaseTypes = allDiseaseTypes.reduce((acc, type) => {
            const checkbox = document.querySelector(`.disease_type input[value="${type}"]`);
            acc[type] = checkbox ? (checkbox.checked ? 1 : 0) : 0;
            console.log('체크박스 값 ', acc);
            return acc;
        }, {});
        console.log('Collected disease types:', diseaseTypes);
        // 체크된 요일만 수집
        const checkedCareWeeks = Array.from(document.querySelectorAll('#care_week_div input:checked')).map(cb => cb.value);
        const careReceiverGender = document.querySelector('input[name="care_receiver_gender"]:checked')?.value || '';
        // 날짜 데이터 수집 및 형식 변환
        const userBirth = document.querySelector('input[name="user_birth"]').value;
        const formattedUserBirth = userBirth.replace(/년 |월 |일/g, '').replace(/ /g, '-');

        // 시간 데이터 수집
        const careStartTime = document.getElementById('care_start_time').value;
        const careEndTime = document.getElementById('care_end_time').value;
        // FormData 객체를 JSON으로 변환
        const formObj = Object.fromEntries(form.entries());
        formObj.diseaseTypes = diseaseTypes;
        formObj.careWeeks = checkedCareWeeks; // 체크된 요일만 추가
        formObj.careReceiverGender = careReceiverGender;
        formObj.user_birth = formattedUserBirth; // 날짜 형식 변환 후 추가
        formObj.care_start_time = careStartTime ? `${careStartTime}:00` : null; // 시간 형식 맞추기
        formObj.care_end_time = careEndTime ? `${careEndTime}:00` : null; // 시간 형식 맞추기
        
        
        fetch('/careRecvReg/careRecvRegi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('!response.ok 에러');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 성공 처리
                console.log('성공 :', data);
                window.location.href = '/'; // 페이지 이동
            } else {
                // 실패 처리
                console.error('실패 :', data);
            }
        })
        .catch(error => {
            console.error('마지막단 에러 :', error);
        });
    
});

// 주소 인풋태그 포커스 됐을때 포커스 해제됐을때 코드
document.addEventListener('DOMContentLoaded', (e) => {
    const inputField = document.getElementById('care_receiver_user_add');
    const originalPlaceholder = inputField.placeholder;

    inputField.addEventListener('focus', () => {
        inputField.placeholder = '';
    });

    inputField.addEventListener('blur', () => {
        inputField.placeholder = originalPlaceholder;
    });
});