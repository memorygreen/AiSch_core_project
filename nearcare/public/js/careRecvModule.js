const maskDatas = function maskDatas (rows){
    // console.log('M_rows', typeof(rows[0].care_receiver_birth));
    
    // let btd_str = JSON.stringify(rows[0].care_receiver_birth);
    // let btd_spl = btd_str.split('-');
    // let btd_spl_d = btd_spl[2].split('T');
    // let btd_data = btd_spl[0]+'년'+btd_spl[1]+'월'+btd_spl_d[0]+'일';
    
    let name_spl = '';
    let name_date = '';
    let phone_spl = '';
    let phoneNum = '';
    let userArr = rows;
    let arrData = [];
    let add_spl = '';
    let add_data = '';
    for(let i = 0; i < userArr.length; i++){
        // 마스킹 처리 하기
        
        btd_str = JSON.stringify(rows[i].care_receiver_birth)
        btd_spl = btd_str.split('-');
        btd_spl_d = btd_spl[2].split('T');

        // btd_data = btd_spl[0]+'년'+btd_spl[1]+'월'+btd_spl_d[0]+'일';
        name_spl = rows[i].care_receiver_name.split('');
        name_date = name_spl[0] + '**';
        phone_spl = rows[i].care_receiver_phone.split('-');
        phoneNum = phone_spl[0] + '-****-****';
        add_spl = rows[i].care_receiver_add.split(' ');
        // console.log('add_spl', add_spl);
        add_data = add_spl[0] + '*****';
        arrData.push({
            userName : name_date,
            userBirth : '****년 **월 **일',
            gender : '**',
            phone : phoneNum,
            careLevel : '*',
            userAdd : add_data,
        });
    };
    // let userArrLength = arrData.length;
    // console.log('arrData', arrData);
    return arrData;
};


module.exports = maskDatas;