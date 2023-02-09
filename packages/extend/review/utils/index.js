/**
 * @description 日期格式化
 *
 * @param date:时间
 * @param format:日期格式化字符串，默认 yyyy-MM-dd hh:mm:ss
 */
function dateFormat(date, format) {
    if (date) {
        date = date instanceof Date ? date : new Date(date);
        let o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };

        format = (format || 'yyyy-MM-dd hh:mm:ss').replace(/y+/i, date.getFullYear());
        for (let i in o) format = format.replace(new RegExp('(' + i + ')'), ('0' + o[i]).slice(-2));
        return format;
    }
    return '';
}

export {
    dateFormat
}