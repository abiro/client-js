"use strict";
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
var EventEmitterTransport_1 = __importDefault(require("./EventEmitterTransport"));
var events_1 = require("events");
var requestData_1 = require("../__mocks__/requestData");
var eventEmitter_1 = require("../__mocks__/eventEmitter");
describe("EventEmitterTransport", function () {
    it("can connect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var emitter, eventEmitterTransport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter = new events_1.EventEmitter();
                    eventEmitterTransport = new EventEmitterTransport_1.default(emitter, "foo://in", "foo://out");
                    return [4 /*yield*/, eventEmitterTransport.connect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("can close", function () {
        var emitter = new events_1.EventEmitter();
        var reqUri = "from";
        var resUri = "to";
        var eventEmitterTransport = new EventEmitterTransport_1.default(emitter, reqUri, resUri);
        eventEmitterTransport.close();
    });
    it("can send and receive data", function () { return __awaiter(void 0, void 0, void 0, function () {
        var emitter, eventEmitterTransport, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter = new events_1.EventEmitter();
                    eventEmitter_1.addMockServerTransport(emitter, "to1://asdf/rpc-request", "from1");
                    eventEmitterTransport = new EventEmitterTransport_1.default(emitter, "from1", "to1://asdf/rpc-request");
                    return [4 /*yield*/, eventEmitterTransport.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, eventEmitterTransport.sendData({
                            request: requestData_1.generateMockRequest(1, "foo", ["bar"]),
                            internalID: 1,
                        })];
                case 2:
                    result = _a.sent();
                    expect(result.method).toEqual("foo");
                    expect(result.params).toEqual(["bar"]);
                    return [2 /*return*/];
            }
        });
    }); });
    it("can send notifications", function () { return __awaiter(void 0, void 0, void 0, function () {
        var emitter, eventEmitterTransport, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter = new events_1.EventEmitter();
                    eventEmitter_1.addMockServerTransport(emitter, "to1://asdf/rpc-notification", "from1");
                    eventEmitterTransport = new EventEmitterTransport_1.default(emitter, "from1", "to1://asdf/rpc-notification");
                    return [4 /*yield*/, eventEmitterTransport.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, eventEmitterTransport.sendData({
                            request: requestData_1.generateMockNotificationRequest("foo", ["bar"]),
                            internalID: 1,
                        })];
                case 2:
                    result = _a.sent();
                    expect(result).toEqual(undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error on bad response", function () { return __awaiter(void 0, void 0, void 0, function () {
        var emitter, eventEmitterTransport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter = new events_1.EventEmitter();
                    eventEmitter_1.addMockServerTransport(emitter, "to1://asdf/rpc-error", "from1");
                    eventEmitterTransport = new EventEmitterTransport_1.default(emitter, "from1", "to1://asdf/rpc-error");
                    return [4 /*yield*/, eventEmitterTransport.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(eventEmitterTransport.sendData({
                            request: requestData_1.generateMockRequest(1, "foo", ["bar"]),
                            internalID: 1,
                        }))
                            .rejects.toThrowError("Error message")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error on bad protocol", function () { return __awaiter(void 0, void 0, void 0, function () {
        var emitter, eventEmitterTransport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter = new events_1.EventEmitter();
                    eventEmitter_1.addMockServerTransport(emitter, "to1://asdf/rpc-error", "from1");
                    eventEmitterTransport = new EventEmitterTransport_1.default(emitter, "from1", "to1://asdf/rpc-error");
                    return [4 /*yield*/, eventEmitterTransport.connect()];
                case 1:
                    _a.sent();
                    eventEmitterTransport.connection.emit = function () { throw new Error("failed protocol"); };
                    return [4 /*yield*/, expect(eventEmitterTransport.sendData({
                            request: requestData_1.generateMockRequest(1, "foo", ["bar"]),
                            internalID: 1,
                        }))
                            .rejects.toThrowError("failed protocol")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
