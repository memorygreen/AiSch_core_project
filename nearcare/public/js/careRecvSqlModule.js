const careRecvListSql = function careRecvListSql(){
    let sql = 'select care_receiver_name, care_receiver_birth, care_receiver_gender, care_receiver_phone, user_email, care_receiver_level, care_receiver_add from TB_USER as u inner join TB_CARE_RECEIVER as r where u.user_id = r.user_id';
    return sql;
};
module.exports = careRecvListSql;