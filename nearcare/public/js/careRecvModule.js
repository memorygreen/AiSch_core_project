const formatDate = require("./formatDate");

const maskDatas = function maskDatas (rows){
    // console.log('rows', rows);
    let nameSpl, nameData, phoneSpl, phoneNum, addSpl, addData, year, month, day, btdStr, btdSpl, btdSplDate, btdData, userPoint, userId, gender, genderSet = '';
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
            phoneNum = phoneSpl[0] + '- **** - ****';
            
            addSpl = rows[i].care_receiver_add.split(' ');
            addData = addSpl[0] + '*****';
            gender = rows[i].care_receiver_gender;
            console.log('genderSet',genderSet);
            arrData.push({
                userId : userId,
                userName : nameData,
                userBirth : '****년 **월 **일',
                gender : gender,
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

const loginUserInfo = function loginUserInfo(rows){
    let birthDay = rows[0].USER_BIRTHDATE;
    let birthDayFormet = formatDate(birthDay);
    let birthDaySplt = birthDayFormet.split('-');
    let userBirth = birthDaySplt[0] + '년 ' + birthDaySplt[1] + '월 ' + birthDaySplt[2] + '일';
    console.log('birthDayFormet',birthDayFormet);
    console.log('birthDaySplt', birthDaySplt[0]);
    let loginUserInfoData = {
        userName : rows[0].USER_NAME,
        userBirth : userBirth,
        phone: rows[0].USER_PHONE,
    };
    return loginUserInfoData;
};

const userInfo = function userInfo (rows) {
    console.log('Raw data from DB:', rows); // 추가된 로그

    // 예시: 데이터를 처리하는 로직 (수정 필요)
    if (!rows || rows.length === 0) {
        throw new Error('Invalid rows data');
    }

    let data = rows[0]; // 단일 레코드가 반환됨
    console.log('Processed user data:', data);
    
    let birthDay = rows[0].CARE_RECEIVER_BIRTH;
    let birthDayFormet = formatDate(birthDay);
    let birthDaySplt = birthDayFormet.split('-');
    let userBirth = birthDaySplt[0] + '년 ' + birthDaySplt[1] + '월 ' + birthDaySplt[2] + '일';
    console.log('birthDayFormet',birthDayFormet);
    console.log('birthDaySplt', birthDaySplt[0]);
    let userInfo = {
        userName : rows[0].CARE_RECEIVER_NAME,
        gender : rows[0].CARE_RECEIVER_GENDER,
        userBirth : userBirth,
        phone: rows[0].CARE_RECEIVER_PHONE,
        userAdd : rows[0].CARE_RECEIVER_ADD,
        careLavel : rows[0].CARE_RECEIVER_LEVEL,
        pay : rows[0].CARE_RECEIVER_PAY,
        careDays : rows[0].CARE_RECEIVER_DAYS,
        dementia: rows[0].CARE_RECEIVER_DEMENTIA,
        meal : rows[0].CARE_RECEIVER_MEAL,
        behavior : rows[0].CARE_RECEIVER_BEHAVIOR,
        dialusis : rows[0].CARE_RECEIVER_DIALYSIS,
        etc : rows[0].CARE_RECEIVER_ETC,
        cancer : rows[0].CARE_RECEIVER_CANCER,
        rehabilitation : rows[0].CARE_RECEIVER_REHABILITATION,
        dialysis : rows[0].CARE_RECEIVER_DIALYSIS,
        evacuation : rows[0].CARE_RECEIVER_EVACUATION
    };
    return userInfo;
};

module.exports = {maskDatas, userInfo, loginUserInfo};