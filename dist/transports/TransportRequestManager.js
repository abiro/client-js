"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportRequestManager = void 0;
var events_1 = require("events");
var Error_1 = require("../Error");
var TransportRequestManager = /** @class */ (function () {
    function TransportRequestManager() {
        this.pendingRequest = {};
        this.pendingBatchRequest = {};
        this.transportEventChannel = new events_1.EventEmitter();
    }
    TransportRequestManager.prototype.addRequest = function (data, timeout) {
        this.transportEventChannel.emit("pending", data);
        if (data instanceof Array) {
            this.addBatchReq(data, timeout);
            return Promise.resolve();
        }
        return this.addReq(data.internalID, timeout);
    };
    TransportRequestManager.prototype.settlePendingRequest = function (request, error) {
        var _this = this;
        request.forEach(function (req) {
            var resolver = _this.pendingRequest[req.internalID];
            delete _this.pendingBatchRequest[req.internalID];
            if (resolver === undefined) {
                return;
            }
            if (error) {
                resolver.reject(error);
                return;
            }
            resolver.resolve();
        });
    };
    TransportRequestManager.prototype.resolveResponse = function (payload, emitError) {
        if (emitError === void 0) { emitError = true; }
        var data = payload;
        try {
            data = JSON.parse(payload);
            if (this.checkJSONRPC(data) === false) {
                throw new Error("Bad response format");
            }
            if (data instanceof Array) {
                return this.resolveBatch(data, emitError);
            }
            return this.resolveRes(data, emitError);
        }
        catch (e) {
            var err = new Error_1.JSONRPCError("Bad response format", Error_1.ERR_UNKNOWN, payload);
            if (emitError) {
                this.transportEventChannel.emit("error", err);
            }
            return err;
        }
    };
    TransportRequestManager.prototype.addBatchReq = function (batches, timeout) {
        var _this = this;
        batches.forEach(function (batch) {
            var resolve = batch.resolve, reject = batch.reject;
            var internalID = batch.request.internalID;
            _this.pendingBatchRequest[internalID] = true;
            _this.pendingRequest[internalID] = { resolve: resolve, reject: reject };
        });
        return Promise.resolve();
    };
    TransportRequestManager.prototype.addReq = function (id, timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (timeout) {
                _this.setRequestTimeout(id, timeout, reject);
            }
            _this.pendingRequest[id] = { resolve: resolve, reject: reject };
        });
    };
    TransportRequestManager.prototype.checkJSONRPC = function (data) {
        var payload = [data];
        if (data instanceof Array) {
            payload = data;
        }
        return payload.every(function (datum) { return (datum.result !== undefined || datum.error !== undefined); });
    };
    TransportRequestManager.prototype.processResult = function (payload, prom) {
        if (payload.error) {
            var err = Error_1.convertJSONToRPCError(payload);
            prom.reject(err);
            return;
        }
        prom.resolve(payload.result);
    };
    TransportRequestManager.prototype.resolveBatch = function (payload, emitError) {
        var _this = this;
        var results = payload.map(function (datum) {
            return _this.resolveRes(datum, emitError);
        });
        var errors = results.filter(function (result) { return result; });
        if (errors.length > 0) {
            return errors[0];
        }
        return undefined;
    };
    TransportRequestManager.prototype.resolveRes = function (data, emitError) {
        var id = data.id, error = data.error;
        var status = this.pendingRequest[id];
        if (status) {
            delete this.pendingRequest[id];
            this.processResult(data, status);
            this.transportEventChannel.emit("response", data);
            return;
        }
        if (id === undefined && error === undefined) {
            this.transportEventChannel.emit("notification", data);
            return;
        }
        var err = new Error_1.JSONRPCError("Could not resolve " + id, Error_1.ERR_MISSIING_ID);
        if (error) {
            err = Error_1.convertJSONToRPCError(data);
        }
        if (emitError) {
            this.transportEventChannel.emit("error", err);
        }
        return err;
    };
    TransportRequestManager.prototype.setRequestTimeout = function (id, timeout, reject) {
        var _this = this;
        setTimeout(function () {
            delete _this.pendingRequest[id];
            reject(new Error_1.JSONRPCError("Request timeout request took longer than " + timeout + " ms to resolve", Error_1.ERR_TIMEOUT));
        }, timeout);
    };
    return TransportRequestManager;
}());
exports.TransportRequestManager = TransportRequestManager;
