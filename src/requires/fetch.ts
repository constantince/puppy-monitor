import ErrorMonitorSpace from '../types/errorspace';

let img: HTMLImageElement;

// 拼接get参数
const handleErrorInfo = <T>(arg: T): string => {
    const finialInfo: T = { ...arg };
    let params = '';
    Object.keys(arg).forEach((item) => {
        params += `${item}=${encodeURIComponent(finialInfo[item])}&`;
    });
    return params.replace(/&$/, '');
};

// 创建dom元素，旧兼容方式发送get请求，无数据返回
const _createDomEl = (src: string): void => {
    img = document.createElement('img');
    img.src = src;
    img.width = 0;
    img.height = 0;
    img.className = 'syt.error.img';
    document.body.appendChild(img);
};

type errors = ErrorMonitorSpace.HandleErrorFn;

// 发送请求
const _get: errors = (url, params) => {
    const addr = `${url}?${handleErrorInfo(params)}`;
    if (img) {
        img.src = addr;
        return;
    }
    _createDomEl(addr);
};

// 找到当前浏览器支持的请求方式
const _createSendMethod = (): errors => {
    if (window.navigator.sendBeacon) { // 优先尝试新版本浏览器特性
        const sendBeaconFn: errors = (url, params) => {
            window.navigator.sendBeacon(url, JSON.stringify(params, (key, value) => {
                if (key === 'element' && value !== null) {
                    return value.className;
                }
                return value;
            }));
        };
        return sendBeaconFn;
    } if (window.fetch) { // 正常版本的请求发送 形参统一
        const fetchFn: errors = (url, params) => {
            window.fetch(url, { body: JSON.stringify(params), method: 'POST', keepalive: true });
        };
        return fetchFn;
    } // 旧浏览器的兼容
    return _get;

    /*
    (window.navigator.sendBeacon && window.navigator.sendBeacon(url, body)) ||
        fetch(url, {body, method: 'POST', keepalive: true});
        */
};

// 缓存默认请求的方式
const SendMethod = _createSendMethod();

export default SendMethod;
