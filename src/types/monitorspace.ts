namespace MonitorSpace {
   type Business = 'ln' | 'cn' | 'msg' | 'url' | 'fy';
   type SystemEum = 'en' | 'os' | 'pf' | 'de' | 'loc' | 'nw';
   type SystemEnmNot = 'loc' | 'nw';
   type PerfEum = 'ttfb' | 'ftd' | 'fid' | 'fcp' | 'lcp' | 'cls' | 'con' | 'req' | 'dom';
   type Metrics = string | number;
   type Metter = 'loadPage' | 'domReady'| 'redirect'| 'lookupDomain'
   | 'ttfb'| 'request'| 'loadEvent'| 'appcache'| 'unloadEvent'| 'connect';

   export type PerformanceStatus  = {
        [K in Metter]: number
   }

   const isBusiness = function (arg: Business | PerfEum): arg is Business {
        return arg in isBusiness;
   }

   export type Bussiness = Partial<{
        [K in Business]: Metrics
    }>

    export type System = {
        readonly [K in Exclude<SystemEum, SystemEnmNot>]?: Metrics 
    } & {
        readonly [U in SystemEnmNot]: Metrics
    }

    export type Perf = Readonly<{
        [K in PerfEum]: Metrics
    }>

    export interface Client {
        readonly traceId: string,
        readonly clientId: string,
        version: string
    }

    export type HandleErrorFn = {
        (url: string, params: ErrorMessageInfo) : void;
    }

    export type ErrorMessageInfo = Client | Bussiness | System;

    export type ConbineErrorPerf = ErrorMessageInfo | Perf | PerformanceStatus;

    export type ErrorNetElement = HTMLImageElement & HTMLScriptElement & {
        link: string
    }
}

export default MonitorSpace;
