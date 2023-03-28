"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_validate_1 = __importDefault(require("./directives/async-validate"));
const async_form_1 = __importDefault(require("./directives/async-form"));
const VuetifyAsyncValidation = {
    install: (Vue, options = {}) => {
        var _a;
        Vue.directive("async-validate", async_validate_1.default((_a = options.debounceInterval) !== null && _a !== void 0 ? _a : 0));
        Vue.directive("async-form", async_form_1.default);
    },
};
exports.default = VuetifyAsyncValidation;
