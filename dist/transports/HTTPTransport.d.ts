import { Transport } from "./Transport";
import { JSONRPCRequestData } from "../Request";
declare type CredentialsOption = "omit" | "same-origin" | "include";
declare class HTTPTransport extends Transport {
    uri: string;
    private readonly credentials;
    constructor(uri: string, credentials?: CredentialsOption);
    connect(): Promise<any>;
    sendData(data: JSONRPCRequestData, timeout?: number): Promise<any>;
    close(): void;
    private onlyNotifications;
}
export default HTTPTransport;
