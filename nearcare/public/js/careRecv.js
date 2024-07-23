const btn = document.getElementsByClassName("user_detl"); // 모달을 띄우는 버튼 요소 가져오기
const modal = document.getElementsByClassName("modalWrap"); // 모달 창 요소 가져오기
const closeBtn = document.getElementsByClassName("closeBtn"); // 모달을 닫는 버튼(X) 요소 가져오기
let btnLeng = btn.length;
for(let i = 0; i <= btnLeng; i++){
    btnLeng
}
btn.onclick = function () {
    console.log('btn:', btnLeng);
    modal.style.display = "block"; // 버튼을 클릭하면 모달을 보이게 함
};

closeBtn.onclick = function () {
    modal.style.display = "none"; // 모달을 닫는 버튼(X)을 클릭하면 모달을 숨김
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"; // 모달 외부를 클릭하면 모달을 숨김
    }
};