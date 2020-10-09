import Communication from './fetch';
import config from '../../config/config.json';
import Puppies from '../types/errorspace';

const serverUrl: string = config.remoteUrl;

class Base {
    constructor() {
        this.base = {
            traceId: 'xgjiengcxjeglamdgg', // from session
            clientId: 'dsfdfsfsfsfs', // from cookie
        };
    }

    _createClientId = (): string => {
        console.log('create-clint-id');
        return '';
    }

    _createTraceId = (): string => {
        console.log('create-trae-id');
        return '';
    }

    base: Puppies.Client

    serverUrl: string = serverUrl;

    fetch = Communication;

    // 心跳处理 发送数据的间隔频率  todo
    heartBeat = (): void => {
        setTimeout(() => {
            // 开始搜索本地数据缓存

        }, 2000);
        console.log('ddd');
    }
}

export default Base;
