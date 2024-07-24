const btns = document.getElementsByClassName("user_det"); // 모달을 띄우는 버튼 요소 가져오기
const modal = document.getElementById("modal_out_wrap"); // 모달 창 요소 가져오기
const cencl_btn = document.getElementById("cencl_btn"); // 모달 창 요소 가져오기

// 만들어진 btn에 이벤트 걸어주기
let btnLeng = btns.length;
for(let i = 0; i < btnLeng; i++){
    btns[i].addEventListener('click', ()=>{
        modal.style.display = "flex"; // 버튼을 클릭하면 모달을 보이게 함
    });
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // 모달 외부를 클릭하면 모달을 숨김
    }
};
cencl_btn.addEventListener('click', ()=>{
        modal.style.display = "none"; // 취소버튼 클릭하면 모달 숨김
});

const payBtn = document.getElementById('pay_btn');
const payModal = document.getElementById('pay_modal_out_wrap');
const payCanclBtn = document.getElementById('point_cencl_btn');
// 결제 확인 모달창에서 확인 누른 후 뜨는 두번째 모달창
payBtn.addEventListener('click', ()=>{
    payModal.style.display = 'flex';
    modal.style.display = 'none';
});
payCanclBtn.addEventListener('click', ()=>{
    modal.style.display = "none"; // 취소버튼 클릭하면 모달 숨김
});
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // 모달 외부를 클릭하면 모달을 숨김
    }
};