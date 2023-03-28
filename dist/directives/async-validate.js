"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const EXAMPLE_USAGE = 'v-asyc-validate:debounce="3000"';
const DEFAULT_DEBOUNCE_INTERVAL = 0;
const RULES_PROP_NAME = "async-rules";
const DEBOUNCE_CHECK_NAME = "$_vuetifyAsyncValidation_debounceCheck";
const validateDebounceInterval = ({ arg, value, }) => {
    if (arg && arg !== "debounce") {
        throw new Error(`The argument of async-validate directive must be "debounce", but received "${arg}"`);
    }
    if (value !== undefined) {
        if (!arg) {
            throw new Error(`Value can only be used with debounce argument. For example, ${EXAMPLE_USAGE}`);
        }
        else if (typeof value !== "number") {
            throw new Error(`The type of value must be a number, but received ${typeof value}`);
        }
        else if (isNaN(value) || value < 0) {
            throw new Error(`The value of debounce must be a number >= 0, but received ${value}`);
        }
    }
    else if (arg) {
        console.warn(`This warning is shown because you used the debounce argument on a v-async-validate directive without value. To remove this warning, either add a value to the directive (for example, ${EXAMPLE_USAGE}) or remove the debounce argument from the directive.`);
    }
    return value;
};
const AsyncValidate = (pluginDebounceInterval) => {
    if (typeof pluginDebounceInterval == "number" &&
        (isNaN(pluginDebounceInterval) || pluginDebounceInterval < 0)) {
        throw new Error(`The value of debounceInterval option in Vue.use(VuetifyAsyncValidation) must be >= 0, but received ${pluginDebounceInterval}`);
    }
    return {
        bind: (element, binding, vnode) => {
            const { componentInstance } = vnode;
            if (!componentInstance)
                return;
            const validateAsync = function (force) {
                return new Promise((resolve) => {
                    const { attrs } = (vnode === null || vnode === void 0 ? void 0 : vnode.data) || {};
                    if (!attrs)
                        return;
                    const rules = attrs[RULES_PROP_NAME];
                    if (!rules) {
                        return;
                    }
                    else if (!Array.isArray(rules)) {
                        throw new Error(`The type of property ${RULES_PROP_NAME} must be array, but received ${typeof rules}`);
                    }
                    const value = this.internalValue;
                    const nextErrorBucket = [];
                    if (force) {
                        this.$data.hasInput = true;
                        this.$data.hasFocused = true;
                    }
                    Promise.all(rules.map((rule) => rule(value))).then((results) => {
                        results.forEach((result) => {
                            const resultType = typeof result;
                            if (result === false || resultType === "string") {
                                nextErrorBucket.push(result || "");
                            }
                            else if (resultType !== "boolean") {
                                throw new Error(`The return value of ${RULES_PROP_NAME} should be either a string or a boolean, but received "${resultType}".`);
                            }
                        });
                        const nextValid = nextErrorBucket.length === 0;
                        if (componentInstance.validateAsync === validateAsync) {
                            this.$data.errorBucket = nextErrorBucket;
                            this.$data.valid = nextValid;
                        }
                        return resolve(nextValid);
                    });
                });
            };
            componentInstance.validateAsync = validateAsync;
        },
        componentUpdated: (element, binding, vnode, oldNode) => {
            var _a, _b, _c, _d;
            const { componentInstance } = vnode;
            if (!componentInstance)
                return;
            const debounceInterval = (_b = (_a = validateDebounceInterval(binding)) !== null && _a !== void 0 ? _a : pluginDebounceInterval) !== null && _b !== void 0 ? _b : DEFAULT_DEBOUNCE_INTERVAL;
            const { attrs } = (vnode === null || vnode === void 0 ? void 0 : vnode.data) || {};
            if (!attrs)
                return;
            // Check rules
            const rules = attrs[RULES_PROP_NAME];
            if (!rules) {
                return;
            }
            else if (!Array.isArray(rules)) {
                throw new Error(`The type of property ${RULES_PROP_NAME} must be an array, but received ${typeof rules}`);
            }
            const { value: currentValue } = ((_c = vnode === null || vnode === void 0 ? void 0 : vnode.componentOptions) === null || _c === void 0 ? void 0 : _c.propsData) || {};
            const { value: previousValue } = ((_d = oldNode === null || oldNode === void 0 ? void 0 : oldNode.componentOptions) === null || _d === void 0 ? void 0 : _d.propsData) || {};
            if (currentValue === previousValue) {
                return;
            }
            const validateAsync = function (force) {
                return new Promise((resolve) => {
                    const { attrs } = (vnode === null || vnode === void 0 ? void 0 : vnode.data) || {};
                    if (!attrs)
                        return;
                    const rules = attrs[RULES_PROP_NAME];
                    if (!rules) {
                        return;
                    }
                    else if (!Array.isArray(rules)) {
                        throw new Error(`The type of property ${RULES_PROP_NAME} must be array, but received ${typeof rules}`);
                    }
                    const value = this.internalValue;
                    const nextErrorBucket = [];
                    if (force) {
                        this.$data.hasInput = true;
                        this.$data.hasFocused = true;
                    }
                    Promise.all(rules.map((rule) => rule(value))).then((results) => {
                        results.forEach((result) => {
                            const resultType = typeof result;
                            if (result === false || resultType === "string") {
                                nextErrorBucket.push(result || "");
                            }
                            else if (resultType !== "boolean") {
                                throw new Error(`The return value of ${RULES_PROP_NAME} should be either a string or a boolean, but received "${resultType}".`);
                            }
                        });
                        const nextValid = nextErrorBucket.length === 0;
                        if (componentInstance.validateAsync === validateAsync) {
                            this.$data.errorBucket = nextErrorBucket;
                            this.$data.valid = nextValid;
                        }
                        return resolve(nextValid);
                    });
                });
            };
            componentInstance.validateAsync = validateAsync;
            const debounceCheck = lodash_debounce_1.default(function (force) {
                if (componentInstance[DEBOUNCE_CHECK_NAME] !== debounceCheck)
                    return;
                componentInstance.validateAsync(force);
            }, debounceInterval);
            componentInstance[DEBOUNCE_CHECK_NAME] = debounceCheck;
            debounceCheck();
        },
    };
};
exports.default = AsyncValidate;
