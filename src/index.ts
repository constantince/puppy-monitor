import ErrorMonitor from './requires/error';
import Performance from './requires/performance';

class PuppyMonitor {
    constructor() {
        console.log('wowowowo....');
    }

    error: ErrorMonitor = new ErrorMonitor();

    performance: Performance = new Performance();

    // 心跳处理 发送数据的间隔频率 todo
    heartBeat = (): void => {
        console.log('ddd');
    }
}

const wowo: PuppyMonitor = new PuppyMonitor();

console.log(wowo);
