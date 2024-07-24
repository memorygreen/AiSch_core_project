const careRecvListSql = function careRecvListSql(){
    let sql = 'select care_receiver_name, care_receiver_birth, care_receiver_gender, care_receiver_phone, user_email, care_receiver_level, care_receiver_add from TB_USER as u inner join TB_CARE_RECEIVER as r where u.user_id = r.user_id';
    return sql;
};
const careRecvRegconfrm = function careRecvRegconfrm(){
    let user_id = 'user001';
    let sql = `select * from TB_CARE_RECEIVER as r left outer join  TB_USER as u  on u.USER_ID = "${user_id}"and r.USER_ID = "${user_id}" `;
    return sql;
};


module.exports = {careRecvListSql, careRecvRegconfrm};