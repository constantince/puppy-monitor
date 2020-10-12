import { UAParser } from 'ua-parser-js';
import Puppies from '../types/errorspace';
import Base from './base';

const ua:UAParser = new UAParser();
const result : IUAParser.IResult = ua.getResult();
// const navigator = window.navigator.geolocation;

class ErrorMonitor extends Base {
    constructor() {
        super();
        this.errorServer = `${this.serverUrl}error`;
        console.log('Main engine enaged... pong pong ~~ pong pong');
        // 系统基础设备信息（os，app系统，cpu，网络环境）TODO
        // this.base = {}; //框架环境基础信息（userId，车牌，车场）TODO
        // this.bus = {}; //基础业务信息（报错，信息，http，自定义）
        // this.identify = {}; //身份信息：（本次调用栈标识，用户标识，错误唯一标识）TODO
        // this.errorUrlContext = []; //报错时上下文调用接口 TODO
        this.init();
    }

    errorServer = ''

    bus: Puppies.Bussiness = {
        ln: 1,
        cn: 10000001,
        msg: 'can not find the errors',
        url: 'null',
        fy: 'js',
    }

    // base: Bussiness

    // identify: Identify

    sys: Puppies.System = {
        en: `${result.engine.name} ${result.engine.version}`,
        de: `${result.device.model} ${result.device.vendor} ${result.device.type}`,
        os: `${result.os.name} ${result.os.version}`,
        pf: `${result.browser.name} ${result.browser.version}`,
        loc: window.location.href,
        nw: 'network',
    }

    init = (): void => {
        window.addEventListener('error', this.error, true);

        window.addEventListener('unhandledrejection', this.error, true);
    }

    // 错误监听函数
    error = (e: ErrorEvent): void => {
        e.stopImmediatePropagation();

        if (e.error) { // JavaScript Error
            const file = e.error.stack;
            let stacks: string[] = [];
            let lc: string[] | string = '0:0';

            if (file) {
                // https:\/\/regex101.com/r/h771ux/1 reg test
                const templateStackInfo: string = file.match(/(?:at)(?:\s+[^\s]+)?\s+\(?((?:https?|file)[^\n)]+)\)?/)[1];
                stacks = !templateStackInfo ? [] : templateStackInfo.split(/:(?=\d+:\d+$)/);
                lc = (stacks[1] || lc).split(':');
            }
            const ln: string | number = lc[0];
            const cn: string | number = lc[1];
            const msg: string = e.message;
            const url: string = stacks[0];
            const fy = 'JAVASCRIPT';
            this.bus = {
                ln, cn, msg, url, fy,
            };
        } else if (e.type === 'error') { // Resource loading Error
            const node: Element | any = e.target;
            if (e.target) {
                if (node.className !== 'syt.error.img') {
                    const ln: string | number = 0;
                    const cn: string | number = 0;
                    const msg = 'static resource load error';
                    const url: string = node.src || node.href;
                    const fy: string = node.nodeName;
                    this.bus = {
                        msg, url, fy, ln, cn,
                    };
                } else {
                    console.error('something goes wrongdd');
                    return;
                }
            }
        }

        this.sendMessage();
    }

    sendMessage = (): void => {
        const urlParams = {
            ...this.bus, ...this.sys, ...this.base,
        };
        this.fetch(this.errorServer, urlParams);
    }

    // 性能日志处理 todo
    performance = (): string => 'performace to do'
}

export default ErrorMonitor;
