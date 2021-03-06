import { JSONRPCRequestData, IJSONRPCData } from "../Request";
import { promiseResolve, promiseReject, TransportEventChannel, TransportResponse } from "./Transport";
export interface IPendingRequest {
    resolve: promiseResolve;
    reject: promiseReject;
}
export declare class TransportRequestManager {
    transportEventChannel: TransportEventChannel;
    private pendingRequest;
    private pendingBatchRequest;
    constructor();
    addRequest(data: JSONRPCRequestData, timeout: number | undefined): Promise<any>;
    settlePendingRequest(request: IJSONRPCData[], error?: Error): void;
    resolveResponse(payload: string, emitError?: boolean): TransportResponse;
    private addBatchReq;
    private addReq;
    private checkJSONRPC;
    private processResult;
    private resolveBatch;
    private resolveRes;
    private setRequestTimeout;
}
