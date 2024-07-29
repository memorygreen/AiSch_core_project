
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

module.exports = {careRecvListSql, careRecvRegconfrm, selectPoint, updateUserPointSql, careRecviInfo, careRecviInfo2};