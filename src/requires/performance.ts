import {
    getCLS, getFID, getLCP, getTTFB, getFCP,
} from 'web-vitals';
import Puppies from '../types/errorspace';
import Base from './base';

class Performance extends Base {
    constructor() {
        super();
        this.perfServer = `${this.serverUrl}perf`;
        this.init();
    }

    perfServer:string;

    // initialize function to get metrics
    init(): void {
        getCLS(this.onReportHander, true);
        getFID(this.onReportHander);
        getLCP(this.onReportHander, true);
        getTTFB(this.onReportHander);
        getFCP(this.onReportHander);
        window.addEventListener('load', () => {
            console.log(window.performance);
        }, true);
    }

    storeDataToSession = () => {
        console.log('store-data-to-session');
        return '';
    }

    storeDataToLocalDataBase = () => {
        console.log('send-data-to-local-database');
        return '';
    }

    bus: Puppies.Perf

    onReportHander = (body):void => {
        const data = Object.assign(body, this.base);
        console.log('body content is:', data);
        this.fetch(this.perfServer, JSON.stringify(data));
    }
}

export default Performance;
