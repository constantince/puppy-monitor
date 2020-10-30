import { UAParser } from 'ua-parser-js';
import Puppies from '../types/monitorspace';
import Base from './base';

const ua = new UAParser();
const result = ua.getResult();
// const navigator = window.navigator.geolocation;

// type ErrorTarget = HTMLElement | HTMLScriptElement | HTMLImageElement | HTMLLinkElement;

class ErrorMonitor extends Base {
    constructor() {
        super();
        this.errorServer = `${this.serverUrl}error`;
        console.log('Main engine enaged... pong pong ~~ pong pong');
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

    base: Puppies.Client

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
                const templateStackInfo = file.match(/(?:at)(?:\s+[^\s]+)?\s+\(?((?:https?|file)[^\n)]+)\)?/)[1];
                stacks = !templateStackInfo ? [] : templateStackInfo.split(/:(?=\d+:\d+$)/);
                lc = (stacks[1] || lc).split(':');
            }
            const ln = lc[0];
            const cn = lc[1];
            const msg = e.message;
            const url = stacks[0];
            const fy = 'JAVASCRIPT';
            this.bus = {
                ln, cn, msg, url, fy,
            };
        } else if (e.type === 'error') { // Resource loading Error
            const node = <Puppies.ErrorNetElement>e.target;
            const fy = node.nodeName;
            const ln = 0;
            const cn = 0;
            const msg = 'static resource load error';
            const url = node.src || node.link;
           
            this.bus = {
                msg, url, fy, ln, cn,
            };
        }

        this.sendMessage();
    }

    sendMessage = (): void => {
        const urlParams: Puppies.ErrorMessageInfo = {
            ...this.bus, ...this.sys, ...this.base,
        };
        this.fetch(this.errorServer, urlParams);
    }

    // 性能日志处理 todo
    performance = (): string => 'performace to do'
}

export default ErrorMonitor;
