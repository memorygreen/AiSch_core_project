
const careRecvListSql = function careRecvListSql(){
    let sql = 'select care_receiver_name, care_receiver_birth, care_receiver_gender, care_receiver_phone, user_email, care_receiver_level, care_receiver_add, user_point, u.USER_ID from TB_USER as u inner join TB_CARE_RECEIVER as r where u.user_id = r.user_id';
    return sql;
};
const careRecvRegconfrm = function careRecvRegconfrm(loginUserId){
    let sql = `select * from TB_USER where USER_ID = "${loginUserId}" `;
    return sql;
};

const selectPoint = function selectPoint(userId){
    let sql = `select USER_POINT from TB_USER where USER_ID = '${userId}'`
    return sql;
};

const updateUserPointSql = function updateUserPointSql(userPoint,userId){
    let pointsToDeduct = 500;
    let sql = `update TB_USER set USER_POINT = ${userPoint} - ${pointsToDeduct} where USER_ID = '${userId}'`;
    
    return sql;
};

const careRecviInfo = function careRecviInfo(selUserId){
    let sql = `select * from TB_CARE_RECEIVER where USER_ID = '${selUserId}'`;
    return sql;
};

const careRecviInfo2 = function careRecviInfo(selUserId){
    let sql = `select * from TB_CARE_RECEIVER AS A, TB_MATCHING AS B where CARE_RECEIVER_ID = '${selUserId}'`;
    return sql;
};

const careRecvInfoInsert = function careRecvInfoInsert(data, userId){
    console.log('sql 쪽 데이터 및 아이디', data, userId);
    let careWeeks = data.careWeeks;
    if (!Array.isArray(careWeeks)) {
        careWeeks = [careWeeks];
    }
    let careWeeksStr = careWeeks.join(',');
    // console.log('sql 쪽 careWeeksStr', careWeeksStr);
    let careLevel = parseInt(data.care_level);
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = `INSERT INTO TB_CARE_RECEIVER (USER_ID, CARE_RECEIVER_NAME, CARE_RECEIVER_BIRTH, CARE_RECEIVER_GENDER, CARE_RECEIVER_LEVEL, CARE_RECEIVER_PHONE, CARE_RECEIVER_ADD, CARE_RECEIVER_DAYS, CARE_RECEIVER_TIME_START, CARE_RECEIVER_TIME_END, CARE_RECEIVER_DEMENTIA, CARE_RECEIVER, CARE_RECEIVER_BEHAVIOR, CARE_RECEIVER_DIALYSIS, CARE_RECEIVER_ETC, CARE_RECEIVER_PAY , CARE_RECEIVER_CREATED_AT ) VALUES('${userId}', '${data.user_name}', '${data.user_birth}', '${data.care_receiver_gender}', '${careLevel}', '${data.user_phone}', '${data.care_receiver_user_add}', '${careWeeksStr}', '${data.care_start_time}', '${data.care_end_time}', '${data.diseaseTypes.dementia}', '${data.diseaseTypes.meal}', '${data.diseaseTypes.behavior}', '${data.diseaseTypes.dialusis}', '${data.text_area}', 0, '${date}')`;
    return sql;
};

module.exports = {careRecvListSql, careRecvRegconfrm, selectPoint, updateUserPointSql, careRecviInfo, careRecviInfo2, careRecvInfoInsert};