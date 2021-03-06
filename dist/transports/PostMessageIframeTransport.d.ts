import { Transport } from "./Transport";
import { JSONRPCRequestData } from "../Request";
declare class PostMessageIframeTransport extends Transport {
    uri: string;
    frame: undefined | null | Window;
    postMessageID: string;
    constructor(uri: string);
    createWindow(uri: string): Promise<Window | null>;
    connect(): Promise<any>;
    sendData(data: JSONRPCRequestData, timeout?: number | undefined): Promise<any>;
    close(): void;
}
export default PostMessageIframeTransport;
