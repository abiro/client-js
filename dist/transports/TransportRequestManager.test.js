"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var reqData = __importStar(require("../__mocks__/requestData"));
var TransportRequestManager_1 = require("./TransportRequestManager");
describe("Transport Request Manager", function () {
    var transportReqMan;
    beforeEach(function () {
        transportReqMan = new TransportRequestManager_1.TransportRequestManager();
    });
    it("should emit pending request", function (done) {
        transportReqMan.transportEventChannel.on("pending", function (data) {
            expect(data).toBeDefined();
            done();
        });
        transportReqMan.addRequest({ request: reqData.generateMockRequest(1, "foo", ["bar"]), internalID: 1 }, undefined);
    });
    it("should timeout pending request after 1s", function () { return __awaiter(void 0, void 0, void 0, function () {
        var prom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transportReqMan.transportEventChannel.on("pending", function (data) {
                        expect(data).toBeDefined();
                    });
                    prom = transportReqMan.addRequest({
                        request: reqData.generateMockRequest(1, "foo", ["bar"]),
                        internalID: 1,
                    }, 1000);
                    return [4 /*yield*/, expect(prom).rejects.toThrowError("timeout")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle adding batch request", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, resolve, reject, request;
        return __generator(this, function (_a) {
            req = { request: reqData.generateMockRequest(1, "foo", ["bar"]), internalID: 1 };
            resolve = function () { };
            reject = function () { };
            request = [{ resolve: resolve, reject: reject, request: req }];
            transportReqMan.addRequest(request, undefined);
            return [2 /*return*/];
        });
    }); });
    it("should error on missing id to resolve", function () {
        var payload = JSON.stringify(reqData.generateMockResponse(9, "haha"));
        var err = transportReqMan.resolveResponse(payload, false);
        expect(err.message).toContain("Could not resolve");
    });
    it("should error on missing id but error response", function () {
        var errPayload = reqData.generateMockErrorResponse(9, "haha");
        delete errPayload.id;
        var payload = JSON.stringify(errPayload);
        var err = transportReqMan.resolveResponse(payload, false);
        expect(err.message).toContain("Error message");
    });
    it("should error on error response without id", function () {
        var errPayload = reqData.generateMockErrorResponse(undefined, "haha");
        delete errPayload.id;
        var payload = JSON.stringify(errPayload);
        var err = transportReqMan.resolveResponse(payload, false);
        expect(err.message).toContain("Error message");
    });
    it("should error on missing id to resolve and emit error", function (done) {
        transportReqMan.transportEventChannel.on("error", function (e) {
            expect(e.message).toContain("Could not resolve");
            done();
        });
        var payload = JSON.stringify(reqData.generateMockResponse(9, "haha"));
        var err = transportReqMan.resolveResponse(payload);
        expect(err.message).toContain("Could not resolve");
    });
    it("should add and reject pending requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, prom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = { request: reqData.generateMockRequest(1, "foo", ["bar"]), internalID: 1 };
                    prom = transportReqMan.addRequest(request, undefined);
                    transportReqMan.settlePendingRequest([request], new Error("rejecting"));
                    return [4 /*yield*/, expect(prom).rejects.toThrowError("rejecting")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should not fail on invalid pending requests", function () {
        var request = { request: reqData.generateMockRequest(1, "foo", ["bar"]), internalID: 1 };
        transportReqMan.settlePendingRequest([request], new Error("rejecting"));
    });
    it("should emit error on bad format for resolving a response", function (done) {
        transportReqMan.transportEventChannel.on("error", function (err) {
            expect(err.message).toContain("Bad response format");
            done();
        });
        transportReqMan.resolveResponse("{}");
    });
    it("should not emit error on bad format for resolving a response", function () {
        var err = transportReqMan.resolveResponse("{}", false);
        expect(err.message).toContain("Bad response format");
    });
    it("should emit response on response && resolve response", function (done) {
        var res = reqData.generateMockResponse(1, false);
        // Add request to queue
        var prom = transportReqMan.addRequest({
            request: reqData.generateMockRequest(1, "foo", ["bar"]),
            internalID: 1,
        }, undefined);
        // Verify that the response resolves the pending request and the response event fires
        transportReqMan.transportEventChannel.on("response", function (responseData) { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prom];
                    case 1:
                        result = _a.sent();
                        expect(responseData.result).toEqual(res.result);
                        expect(result).toEqual(res.result);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        // Resolve pending request;
        transportReqMan.resolveResponse(JSON.stringify(res));
    });
    it("should emit response on batch request &&  resolve response", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var res, requestData, resolve, reject, prom, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = [reqData.generateMockResponse(1, "hello")];
                    requestData = {
                        request: reqData.generateMockRequest(1, "foo", ["bar"]),
                        internalID: 1,
                    };
                    resolve = function (data) {
                        done();
                    };
                    reject = function () {
                    };
                    prom = transportReqMan.addRequest([{ request: requestData, resolve: resolve, reject: reject }], undefined);
                    // Verify that the response resolves the pending request and the response event fires
                    transportReqMan.transportEventChannel.on("response", function (responseData) {
                        expect(responseData.result).toEqual(res[0].result);
                        expect(result).toEqual(res[0].result);
                    });
                    return [4 /*yield*/, prom];
                case 1:
                    result = _a.sent();
                    // Resolve pending request;
                    transportReqMan.resolveResponse(JSON.stringify(res), false);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should emit response on batch request &&  reject invalid response", function () {
        var res = reqData.generateMockResponse(2, "hello");
        // Add request to queue
        var requestData = {
            request: reqData.generateMockRequest(1, "foo", ["bar"]),
            internalID: 1,
        };
        // tslint:disable-next-line:no-empty
        var resolve = function (data) {
        };
        // tslint:disable-next-line:no-empty
        var reject = function () { };
        transportReqMan.addRequest([{ request: requestData, resolve: resolve, reject: reject }], undefined);
        // Resolve pending request;
        var err = transportReqMan.resolveResponse(JSON.stringify([res]), false);
        expect(err.message).toContain("Could not resolve");
    });
    it("should emit notification on notification response", function (done) {
        transportReqMan.transportEventChannel.on("notification", function (data) {
            expect(data.result).toEqual("hello");
            done();
        });
        transportReqMan.resolveResponse(JSON.stringify(reqData.generateMockNotificationResponse("hello")));
    });
    it("should emit error on garbage response", function (done) {
        transportReqMan.transportEventChannel.on("error", function (err) {
            done();
        });
        transportReqMan.resolveResponse("garbage");
    });
    it("should emit data on proper error response and reject req prom.", function (done) {
        var prom = transportReqMan.addRequest({
            request: reqData.generateMockRequest(1, "foo", ["bar"]),
            internalID: 1,
        }, undefined);
        transportReqMan.transportEventChannel.on("response", function (data) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (data.error === undefined) {
                            throw new Error("Missing error");
                        }
                        expect(data.error.data).toEqual("Bad terrible data");
                        return [4 /*yield*/, expect(prom).rejects.toThrowError("Error message")];
                    case 1:
                        _a.sent();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        transportReqMan.resolveResponse(JSON.stringify(reqData.generateMockErrorResponse(1, "Bad terrible data")));
    });
});
