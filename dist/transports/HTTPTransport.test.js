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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPTransport_1 = __importDefault(require("./HTTPTransport"));
var reqMocks = __importStar(require("../__mocks__/requestData"));
describe("HTTPTransport", function () {
    it("can connect", function () {
        var httpTransport = new HTTPTransport_1.default("http://localhost:8545");
        return httpTransport.connect();
    });
    it("can close", function () {
        var httpTransport = new HTTPTransport_1.default("http://localhost:8545");
        httpTransport.close();
    });
    it("can send and retrieve request data", function () { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/rpc-request");
                    data = reqMocks.generateMockRequest(1, "foo", ["bar"]);
                    return [4 /*yield*/, httpTransport.sendData({ request: data, internalID: 1 })];
                case 1:
                    result = _a.sent();
                    expect(result.method).toEqual("foo");
                    expect(result.params).toEqual(["bar"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can send notification data", function () { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/rpc-notification");
                    data = reqMocks.generateMockNotificationRequest("foo", ["bar"]);
                    return [4 /*yield*/, httpTransport.sendData({ request: data, internalID: 1 })];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error on error response", function () { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/rpc-error");
                    data = reqMocks.generateMockRequest(9, "foo", ["bar"]);
                    return [4 /*yield*/, expect(httpTransport.sendData({ request: data, internalID: 9 })).rejects.toThrowError("Error message")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error on bad data response", function () { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/rpc-garbage");
                    data = { request: reqMocks.generateMockRequest(9, "foo", ["bar"]), internalID: 9 };
                    return [4 /*yield*/, expect(httpTransport.sendData(data)).rejects.toThrowError("Bad response format")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error on bad data response from a batch", function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/rpc-garbage");
                    data = {
                        resolve: function (d) { return ({}); },
                        reject: function (e) {
                            expect(e.message).toContain("Bad response format");
                            done();
                        },
                        request: { request: reqMocks.generateMockRequest(9, "foo", ["bar"]), internalID: 9 },
                    };
                    return [4 /*yield*/, expect(httpTransport.sendData([data])).rejects.toThrow("Bad response format")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error if unknown server crash", function () { return __awaiter(void 0, void 0, void 0, function () {
        var httpTransport, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpTransport = new HTTPTransport_1.default("http://localhost:8545/crash");
                    data = { request: reqMocks.generateMockRequest(9, "foo", ["bar"]), internalID: 9 };
                    return [4 /*yield*/, expect(httpTransport.sendData(data)).rejects.toThrowError("Random Segfault that crashes fetch")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
