declare namespace ErrorMonitorSpace {
   type BussinessEum = 'ln' | 'cn' | 'msg' | 'url' | 'fy';
   type SystemEum = 'en' | 'os' | 'pf' | 'de';
   type SystemEnmNot = 'loc' | 'nw';
   type PerfEum = 'ttfb' | 'ftd' | 'fid' | 'fcp' | 'lcp' | 'cls' | 'con' | 'req' | 'dom';
   type Metrics = string | number;
   export type Bussiness = {
        [K in BussinessEum]: Metrics
    }

    export type System = {
        [K in SystemEum]?: Metrics 
    } & {
        [U in SystemEnmNot]: Metrics
    }

    export type Perf = {
        [K in PerfEum]: Metrics
    }

    export interface Client {
        traceId: string,
        clientId: string,
        version: string
    }

    export type HandleErrorFn = {
        (url: string, params: ErrorMessageInfo) : void;
    }

    export type ErrorMessageInfo = Client & Bussiness & System;
}

export default ErrorMonitorSpace;
