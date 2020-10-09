declare namespace ErrorMonitorSpace {

    export interface Bussiness {
        ln: string | number,
        cn: string | number,
        msg: string,
        url: string,
        fy: string
    }

    export interface System {
        en?: string
        os?: string,
        pf?: string,
        de?: string,
        loc: string,
        nw: string
    }

    export interface Perf {
        ttfb: number,
        ftd: number,
        fid: number,
        fcp: number,
        lcp: number,
        cls: number,
        con: number,
        req: number,
        dom: number
    }

    export interface Client {
        traceId: string,
        clientId: string
    }
}

export default ErrorMonitorSpace;
