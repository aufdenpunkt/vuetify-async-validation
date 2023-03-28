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
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncForm = {
    bind: (element, binding, vnode) => {
        const { componentInstance } = vnode;
        /**
         * For reference, please see
         * @see {@link https://github.com/vuetifyjs/vuetify/blob/4bf78761cc7abcf4719985d8cf5d63cab6b901c2/packages/vuetify/src/components/VForm/VForm.ts#L90}
         */
        componentInstance.validateAsync = function () {
            return __awaiter(this, void 0, void 0, function* () {
                const results = yield Promise.all(this.$data.inputs.map((input) => input.validateAsync ? input.validateAsync(true) : input.validate(true)));
                return results.filter((x) => !x).length === 0;
            });
        };
    },
};
exports.default = AsyncForm;
