
document.getElementById('care_recv_regi_form').addEventListener('submit', function(e) {
    e.preventDefault(); // 기본 form 제출 동작을 막음

    const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
    if (csrfMetaTag) {
        const form = new FormData(this);

        // 체크박스 값을 수집하여 배열로 변환
        const diseaseTypes = Array.from(document.querySelectorAll('#disease_type input:checked')).map(cb => cb.value);
        const careWeeks = Array.from(document.querySelectorAll('#care_week_div input:checked')).map(cb => cb.value);
        const careReceiverGender = document.querySelector('input[name="care_receiver_gender"]:checked').value;
        const careLevel = document.querySelector('input[name="care_level"]:checked').value;
        // FormData에 추가
        form.append('diseaseTypes', JSON.stringify(diseaseTypes));
        form.append('careWeeks', JSON.stringify(careWeeks));
        form.append('careReceiverGender', careReceiverGender);
        form.append('careLevel', careLevel);

        fetch('/careRecvReg/careRecvRegi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 변경
            },
            body: JSON.stringify(Object.fromEntries(form.entries())) // JSON 형식으로 변환
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
            } else {
                // 실패 처리
                console.error('실패 :', data);
            }
        })
        .catch(error => {
            console.error('마지막단 에러 :', error);
        });
    }
});
