"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importDefault(require("."));
var RequestManager_1 = __importDefault(require("./RequestManager"));
var EventEmitterTransport_1 = __importDefault(require("./transports/EventEmitterTransport"));
var events_1 = require("events");
describe("client-js", function () {
    it("can be constructed", function () {
        var emitter = new events_1.EventEmitter();
        var c = new _1.default(new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]));
        expect(!!c).toEqual(true);
    });
    it("has a request method that returns a promise", function () {
        var emitter = new events_1.EventEmitter();
        var c = new _1.default(new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]));
        expect(typeof c.request).toEqual("function");
        expect(typeof c.request("my_method", null).then).toEqual("function");
    });
    it("has a notify method that returns a promise", function () {
        var emitter = new events_1.EventEmitter();
        var c = new _1.default(new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]));
        expect(typeof c.request).toEqual("function");
        expect(typeof c.notify("my_method", null).then).toEqual("function");
    });
    it("can register error and subscription handlers", function () {
        var emitter = new events_1.EventEmitter();
        var c = new _1.default(new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]));
        // tslint:disable-next-line:no-empty
        c.onError(function (err) { });
        // tslint:disable-next-line:no-empty
        c.onNotification(function (data) { });
    });
    describe("startBatch", function () {
        it("calls startBatch", function () {
            var emitter = new events_1.EventEmitter();
            var rm = new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]);
            var c = new _1.default(rm);
            c.startBatch();
            //      expect(mockedRequestManager.mock.instances[0].startBatch).toHaveBeenCalled();
        });
    });
    describe("can call stopBatch", function () {
        var emitter = new events_1.EventEmitter();
        var rm = new RequestManager_1.default([new EventEmitterTransport_1.default(emitter, "from1", "to1")]);
        var c = new _1.default(rm);
        c.startBatch();
        c.stopBatch();
    });
});
