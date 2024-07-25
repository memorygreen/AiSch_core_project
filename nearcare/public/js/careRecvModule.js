const maskDatas = function maskDatas (rows){
    // console.log('rows', rows);
    let nameSpl, nameData, phoneSpl, phoneNum, addSpl, addData, year, month, day, btdStr, btdSpl, btdSplDate, btdData, userPoint, userId = '';
    let userArr = rows;
    let arrData = [];
    try {
        // 조회된 데이터만큼 마스킹 처리 하기
        for(let i = 0; i < userArr.length; i++){
            
            userId = rows[i].USER_ID;
            // console.log('userId',userId);

            // btd_str = JSON.stringify(rows[i].care_receiver_birth)
            // btd_spl = btd_str.split('T');
            // btd_spl_date = btd_spl[0].split('-');
            btdStr = JSON.stringify(rows[i].care_receiver_birth)
            btdSpl = btdStr.split('T');
            btdSplDate = btdSpl[0].split('-');
            year = btdSplDate[0];
            month = btdSplDate[1];
            day = btdSplDate[2];
            // btd_data = year + '년 ' + month + '월 ' + day + '일';
            btdData = year + '년 ' + month + '월 ' + day + '일';
            
            nameSpl = rows[i].care_receiver_name.split('');
            nameData = nameSpl[0] + '*' + nameSpl[2];
            
            phoneSpl = rows[i].care_receiver_phone.split('-');
            phoneNum = phoneSpl[0] + '-****-****';
            
            addSpl = rows[i].care_receiver_add.split(' ');
            addData = addSpl[0] + '*****';
            
            arrData.push({
                userId : userId,
                userName : nameData,
                userBirth : '****년 **월 **일',
                gender : '**',
                phone : phoneNum,
                careLevel : '*',
                userAdd : addData,
                userPoint : userPoint
            });
        };
        return arrData;

    } catch (e) {
        console.log('maskDatas Error!!');
    }
};

const pointInnerTxtRet = function pointInnerTxtRet () {
    let pointInnerTxt = document.getElementById('point_inner_txt');
    console.log('pointInnerTxt.innerText',(pointInnerTxt.innerText));
    return pointInnerTxt;
};
const pointPayUpdate = function pointPayUpdate(){
    // return pointInnerTxt.innerText;
    pointInnerTxtRet();
    // console.log('pointPayUpdate', pointInnerTxt);
};



module.exports = {maskDatas, pointPayUpdate, pointInnerTxtRet};