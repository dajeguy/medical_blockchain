"use strict";
/*
  SPDX-License-Identifier: Apache-2.0
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionModel = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let OptionModel = class OptionModel {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], OptionModel.prototype, "Key", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], OptionModel.prototype, "Description", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], OptionModel.prototype, "Value", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], OptionModel.prototype, "Comment", void 0);
OptionModel = __decorate([
    fabric_contract_api_1.Object()
], OptionModel);
exports.OptionModel = OptionModel;
//# sourceMappingURL=OptionModel.js.map