import Cookies from 'js-cookie';
import Communication from './fetch';
import config from '../../config/config.json';
import Puppies from '../types/errorspace';

const serverUrl: string = config.remoteUrl;
const CLIENT_KEY = 'puppy.client.id';
const TRACE_KEY = 'puppy.trace.id';
const VERSION_KEY = 'puppy.version.num';
class Base {
    constructor() {
        // 系统基础设备信息（os，app系统，cpu，网络环境）TODO
        // this.base = {}; //框架环境基础信息（userId，车牌，车场）TODO
        // this.bus = {}; //基础业务信息（报错，信息，http，自定义）
        // this.identify = {}; //身份信息：（本次调用栈标识，用户标识，错误唯一标识）TODO
        // this.errorUrlContext = []; //报错时上下文调用接口 TODO
        this.base = {
            traceId: this._createTraceId(), // from session
            clientId: this._createClientId(), // from cookie
            version: this._createVersion(),
        };
    }

    _createRandom = (): string => Math.random().toString().replace(/^0\./, '')

    // 创建用户唯一标识
    _createClientId = (): string => {
        const cookie = Cookies.get(CLIENT_KEY);
        if (cookie) {
            return cookie;
        }
        const r = this._createRandom();
        Cookies.set(CLIENT_KEY, r, { expires: 700 });
        return r;
    }

    // 本次追踪栈id
    _createTraceId = (): string => {
        const traceId = window.sessionStorage.getItem(TRACE_KEY);
        if (traceId) {
            return traceId;
        }
        const r = this._createRandom();
        window.sessionStorage.setItem(TRACE_KEY, r);
        return r;
    }

    // 获取js脚本的版本：即当前业务版本号
    getLatestVersion = () => {
        const entries = window.performance.getEntries();
        const result = entries.find((perf) => /puppy-monitor/.test(perf.name));
        if (result) {
            return result.name.match(/(?:\?v=)(.+)$/)[1];
        }
        return null;
    }

    // 对版本进行对比
    compareVersion = (): boolean => {
        const newVersion = this.getLatestVersion();
        const oldVersion = Cookies.get(VERSION_KEY);
        if (newVersion !== oldVersion) {
            Cookies.set(VERSION_KEY, newVersion, { expires: 70 });
        }
        console.log('new version --->', newVersion, 'old version --->', oldVersion);
        return newVersion === oldVersion;
    }

    // 创建版本号
    _createVersion(): string {
        return this.getLatestVersion();
    }

    public base: Puppies.Client;

    serverUrl: string = serverUrl;

    fetch = Communication;

    // 心跳处理 发送数据的间隔频率  todo
    heartBeat = (): void => {
        setTimeout(() => {
            // 开始搜索本地数据缓存

        }, 2000);
    }
}

export default Base;
