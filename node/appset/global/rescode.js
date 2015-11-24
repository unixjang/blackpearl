/**
 * Created by hyochan on 8/8/15.
 */
const resCode = {
    NO_REQ_PARAM : -4,
    ERR_PARAM : -3, // 정수형이어야 되는데 문자가 들어오는 경우
    ALREADY_INSERTED : -2,
    FAILED : -1,
    NO_DATA : 0,
    SUCCESS : 1
};

module.exports = resCode;