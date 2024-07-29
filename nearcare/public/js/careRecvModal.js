// const { response } = require("express");

// import { response } from "express";

// 상세보기 버튼
const btns = document.getElementsByClassName("user_det");
const userInfo = document.getElementsByClassName("inner_u_list_div3");
// 첫번째 모달창 요소
const modal = document.getElementById("modal_out_wrap");
const checkBtn = document.getElementById('check_btn');
const cenclBtn = document.getElementById("cencl_btn");

// 두번째 모달창 요소
const payModal = document.getElementById('pay_modal_out_wrap');
const pointPayBtn = document.getElementById('point_pay_btn');
const payCanclBtn = document.getElementById('point_cencl_btn');
// let selectedUserId = null;

// 세번째 모달창 요소
const completePayModal = document.getElementById('complete_pay_modal_out_wrap');
const completePayBtn = document.getElementById('complete_pay_btn');

// 결제 실패 모달창
const failModal = document.getElementById('fail_modal_out_wrap');
const failBtn = document.getElementById('fail_btn');
// 토큰 값
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let selectedUserId = null;

// 만들어진 상세보기버튼들 이벤트 걸어주기
let btnLeng = btns.length;
for (let i = 0; i < btnLeng; i++) {
    btns[i].addEventListener('click', (event) => {
        const form = event.target.closest('.inner_u_list_div1'); // 클릭한 버튼이 속한 div 태그 찾기
        selectedUserId = form.dataset.userId;
        fetch('/careRecvReg/setSelectedUid', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',  // 요청 본문이 JSON 형식임을 
                'CSRF-Token' : csrfToken
            },
            body : JSON.stringify({selectedUserId})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                modal.style.display = "flex"; // 버튼을 클릭하면 모달을 보이게 함
            };
        })
        .catch(err =>{
            console.error('setSelectedUid 에러났어..', err);
        });
    });
};

// 결제할 포인트 조회해온 후  fetch 호출
checkBtn.addEventListener('click', () => {

    fetch('/careRecvReg/selPoint', {
        method: 'POST',  // HTTP 메서드를 POST로 설정
        headers: {
            'Content-Type': 'application/json',  // 요청 본문이 JSON 형식임을 명시
            'CSRF-Token' : csrfToken
        },
        // body : JSON.stringify({userId : userId})
    })
    .then(response => {
        // 응답 상태가 OK(200)인지 확인
        if (!response.ok) {
            // 상태 코드가 200이 아닌 경우 에러 발생
            throw new Error('에러났대..');
        };
        // 응답을 JSON 형태로 변환하여 반환
        return response.json();
    })
    .then(data => {
         // 서버에서 반환한 데이터를 이용하여 결제 정보를 모달에 표시
        if(data.userPoint < 500){//조회해온 포인트가 결제할 500포인트보다 작으면
            console.log('data.userPoint',data.userPoint);
            failModal.style.display = 'flex';// 결제 실패 모달창 띄우고
            payModal.style.display = "none";// 나머지 모달창 닫기
            modal.style.display = "none";// 나머지 모달창 닫기
            document.getElementById('fail_inner_txt').innerText = data.userPoint + ' P'; //잔여 포인트 페이지에 보여주기
        }else{
        // 정상적으로 조회해온 포인트 페이지에 보여주기
        document.getElementById('point_inner_txt').innerText = data.userPoint + ' P';
        modal.style.display = "none";
        // 결제 확인 모달창 표시
        payModal.style.display = "flex";
        };

    })
    .catch(error => {
        // 에러 발생 시 에러 메시지를 콘솔에 출력
        console.error('selPoint 마지막단 에러 났어', error);
    });
});

// 결제 실패 모달 확인 버튼
failBtn.addEventListener('click', ()=>{
    failModal.style.display = 'none';
    
});

// 결제 버튼 클릭했을 때
pointPayBtn.addEventListener('click',()=>{
    console.log('결제 버튼 클릭됨');
    fetch('/careRecvReg/pay', {
        method: 'POST',  // HTTP 메서드를 POST로 설정
        headers: {
            'Content-Type': 'application/json',  // 요청 본문이 JSON 형식임을 명시
            'CSRF-Token' : csrfToken
        },
        // body : JSON.stringify({userId : userId})
    })
    .then(response => {
        // 응답 상태가 OK(200)인지 확인
        if (!response.ok) {
            // 상태 코드가 200이 아닌 경우 에러 발생
            throw new Error('careRecvReg/pay 에러났대..');
        };
        // 응답을 JSON 형태로 변환하여 반환
        return response.json();
    })
    .then(data => {
        // 서버에서 반환한 데이터를 이용하여 결제 정보를 모달에 표시
        console.log('data:', data);
        console.log('data.paymentInfo',data.paymentInfo);
        if(data.reUserPoint < 500){
            console.log('data.userPoint',data.reUserPoint);
        }else{
            document.getElementById('reUserPoint_inner_txt').innerText = data.reUserPoint+' P';
            payModal.style.display = "none";
            completePayModal.style.display = "flex";
        };
    })
    .catch(error => {
        // 에러 발생 시 에러 메시지를 콘솔에 출력
        console.error('pay 마지막단 에러 났어', error);
    });
});

// 세번쩨 모달창 확인 버튼 클릭 시
completePayBtn.addEventListener('click', ()=>{
    window.location.href = '/careRecvReg/careRecvDetail';
}); 

// 모달창 바깥 영역 클릭시 모달창 없애기
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // 모달 외부를 클릭하면 모달을 숨김
    } else if(event.target == completePayModal){
        completePayModal.style.display = "none"; // 모달 외부를 클릭하면 모달을 숨김
    };
};

// 첫번째 모달창 취소 버튼
cenclBtn.addEventListener('click', () => {
    modal.style.display = "none"; // 취소버튼 클릭하면 모달 숨김
});

// 두번째 모달 창 취소 버튼
payCanclBtn.addEventListener('click', () => {
    payModal.style.display = "none"; // 취소버튼 클릭하면 모달 숨김
});

