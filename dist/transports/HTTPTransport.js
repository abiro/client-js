"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var Transport_1 = require("./Transport");
var Request_1 = require("../Request");
var Error_1 = require("../Error");
var HTTPTransport = /** @class */ (function (_super) {
    __extends(HTTPTransport, _super);
    function HTTPTransport(uri, credentials) {
        if (credentials === void 0) { credentials = "omit"; }
        var _this = _super.call(this) || this;
        _this.onlyNotifications = function (data) {
            if (data instanceof Array) {
                return data.every(function (datum) { return datum.request.request.id === null || datum.request.request.id === undefined; });
            }
            return (data.request.id === null || data.request.id === undefined);
        };
        _this.uri = uri;
        _this.credentials = credentials;
        return _this;
    }
    HTTPTransport.prototype.connect = function () {
        return Promise.resolve();
    };
    HTTPTransport.prototype.sendData = function (data, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var prom, notifications, batch, result, body, responseErr, e_1, responseErr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prom = this.transportRequestManager.addRequest(data, timeout);
                        notifications = Request_1.getNotifications(data);
                        batch = Request_1.getBatchRequests(data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, isomorphic_fetch_1.default(this.uri, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(this.parseData(data)),
                                credentials: this.credentials
                            })];
                    case 2:
                        result = _a.sent();
                        // requirements are that notifications are successfully sent
                        this.transportRequestManager.settlePendingRequest(notifications);
                        if (this.onlyNotifications(data)) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, result.text()];
                    case 3:
                        body = _a.sent();
                        responseErr = this.transportRequestManager.resolveResponse(body);
                        if (responseErr) {
                            // requirements are that batch requuests are successfully resolved
                            // this ensures that individual requests within the batch request are settled
                            this.transportRequestManager.settlePendingRequest(batch, responseErr);
                            return [2 /*return*/, Promise.reject(responseErr)];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        responseErr = new Error_1.JSONRPCError(e_1.message, Error_1.ERR_UNKNOWN, e_1);
                        this.transportRequestManager.settlePendingRequest(notifications, responseErr);
                        this.transportRequestManager.settlePendingRequest(Request_1.getBatchRequests(data), responseErr);
                        return [2 /*return*/, Promise.reject(responseErr)];
                    case 5: return [2 /*return*/, prom];
                }
            });
        });
    };
    // tslint:disable-next-line:no-empty
    HTTPTransport.prototype.close = function () { };
    return HTTPTransport;
}(Transport_1.Transport));
exports.default = HTTPTransport;
