import {
    getCLS, getFID, getLCP, getTTFB, getFCP,
} from 'web-vitals';
import Puppies from '../types/monitorspace';
import Base from './base';

const longtaskObserver: PerformanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((item) => {
        console.log('list entry:', item.toJSON());
    });
    // console.log('list entry:', list.getEntries());
});

const paintObserver: PerformanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((item) => {
        console.log('list entry:', item.toJSON());
    });
    // console.log('list entry:', list.getEntries());
});

const ttfbObserver: PerformanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((item) => {
        console.log('list entry:', item.toJSON());
    });
    // console.log('list entry:', list.getEntries());
});

longtaskObserver.observe({ entryTypes: ['longtask'] });
paintObserver.observe({ entryTypes: ['largest-contentful-paint'] });
ttfbObserver.observe({ entryTypes: ['resource'] });
class Performance extends Base {
    constructor() {
        super();
        this.metricsServer = `${this.serverUrl}metrics`;
        this.perfServer = `${this.serverUrl}perf`;
        this.init();
    //     getCLS(this.onReportHander, true); // Culmilative Layout Shifts
    //     getFID(this.onReportHander); // First Input Delay
    //     getLCP(this.onReportHander, true); // Largest Contentful Paint
    //     getTTFB(this.onReportHander); // Time To First Byte
    //     getFCP(this.onReportHander); // First Contentful Paint
     }

    perfServer:string;

    metricsServer: string;

    // initialize function to get metrics
    init(): void {
        // 业务版本升级，才需要发送性能报告。否则频繁发送，毫无意义。
        if (!this.compareVersion()) {
            // 开始发送性能报告，延迟执行，保证数据尽量准确
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const data = this.calculater<Puppies.PerformanceStatus>(window.performance.toJSON().timing);
                    this.onReportHander(data, this.perfServer);
                }, 1000);
            }, true);
        }
    }

    calculater = <T>(t: PerformanceTiming): T => {
        let times: Puppies.PerformanceStatus;
        // 【重要】页面加载完成的时间
        // 【原因】这几乎代表了用户等待页面可用的时间
        times.loadPage = t.loadEventEnd - t.navigationStart;

        // 【重要】解析 DOM 树结构的时间
        // 【原因】反省下你的 DOM 树嵌套是不是太多了！
        times.domReady = t.domComplete - t.responseEnd;

        // 【重要】重定向的时间
        // 【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
        times.redirect = t.redirectEnd - t.redirectStart;

        // 【重要】DNS 查询时间
        // 【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
        // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
        times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

        // 【重要】读取页面第一个字节的时间
        // 【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
        // TTFB 即 Time To First Byte 的意思
        // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
        times.ttfb = t.responseStart - t.navigationStart;

        // 【重要】内容加载完成的时间
        // 【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
        times.request = t.responseEnd - t.requestStart;

        // 【重要】执行 onload 回调函数的时间
        // 【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
        times.loadEvent = t.loadEventEnd - t.loadEventStart;

        // DNS 缓存时间
        times.appcache = t.domainLookupStart - t.fetchStart;

        // 卸载页面的时间
        times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

        // TCP 建立连接完成握手的时间
        times.connect = t.connectEnd - t.connectStart;

        return times;
    }

    storeDataToSession = ():string => {
        console.log('store-data-to-session');
        return '';
    }

    storeDataToLocalDataBase = ():string => {
        console.log('send-data-to-local-database');
        return '';
    }

    bus: Puppies.Perf;

    onReportHander = (body: Puppies.ConbineErrorPerf, url: string = this.metricsServer): void => {
        const data = Object.assign(body, this.base);
        // console.log('body content is:', data);
        this.fetch(url, data);
    }
}

export default Performance;
