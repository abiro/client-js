/// <reference types="node" />
import { Transport } from "./transports/Transport";
import { IBatchRequest } from "./Request";
import { JSONRPCError } from "./Error";
import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
export declare type RequestChannel = StrictEventEmitter<EventEmitter, IRequestEvents>;
export interface IRequestEvents {
    "error": (err: JSONRPCError) => void;
    "notification": (data: any) => void;
}
declare class RequestManager {
    transports: Transport[];
    connectPromise: Promise<any>;
    batch: IBatchRequest[];
    requestChannel: RequestChannel;
    private requests;
    private batchStarted;
    private lastId;
    constructor(transports: Transport[]);
    connect(): Promise<any>;
    getPrimaryTransport(): Transport;
    request(method: string, params: any[], notification?: boolean, timeout?: number): Promise<any>;
    close(): void;
    /**
     * Begins a batch call by setting the [[RequestManager.batchStarted]] flag to `true`.
     *
     * [[RequestManager.batch]] is a singleton - only one batch can exist at a given time, per [[RequestManager]].
     *
     */
    startBatch(): void;
    stopBatch(): void;
    private makeRequest;
    private handleError;
    private handleNotification;
}
export default RequestManager;
