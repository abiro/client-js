import RequestManager from "./RequestManager";
import EventEmitterTransport from "./transports/EventEmitterTransport";
import HTTPTransport from "./transports/HTTPTransport";
import WebSocketTransport from "./transports/WebSocketTransport";

interface IClient {
  request(method: string, params: any): Promise<any>;
}

/**
 * OpenRPC Client JS is a browser-compatible JSON-RPC client with multiple transports and
 * multiple request managers to enable features like round-robin or fallback-by-position.
 *
 * @example
 * ```typescript
 * import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js';
 * const transport = new HTTPTransport('http://localhost:3333');
 * const client = new Client(new RequestManager([transport]));
 * const result = await client.request(‘addition’, [2, 2]);
 * // => { jsonrpc: '2.0', id: 1, result: 4 }
 * ```
 *
 */

class Client implements IClient {
  public requestManager: RequestManager;
  constructor(requestManager: RequestManager) {
    this.requestManager = requestManager;
  }

  /**
   * Starts a JSON-RPC Batch call. The client will batch following requests.
   * This method REQUIRES endBatch be called when finished calling requests.
   */
  public startBatch(): void {
    return this.requestManager.startBatch();
  }

  /**
   * Ends a JSON-RPC Batch call. This client will batch requests from when startBatch
   * was called until endBatch. This REQUIRES startBatch to be called first.
   */
  public endBatch(): void {
    return this.requestManager.endBatch();
  }
  /**
   * A JSON-RPC call is represented by sending a Request object to a Server.
   *
   * @param method A String containing the name of the method to be invoked.
   * Method names that begin with the word rpc followed by a
   * period character (U+002E or ASCII 46) are reserved for rpc-internal
   * methods and extensions and MUST NOT be used for anything else.
   * @param params A Structured value that holds the parameter values to be used during the invocation of the method.
   */
  public async request(method: string, params: any) {
    await this.requestManager.connectPromise;
    return this.requestManager.request(method, params);
  }
}

export default Client;
export {
  Client,
  RequestManager,
  HTTPTransport,
  EventEmitterTransport,
  WebSocketTransport,
};
