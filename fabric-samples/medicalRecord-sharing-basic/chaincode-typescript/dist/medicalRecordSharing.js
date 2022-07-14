"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordSharingContract = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let MedicalRecordSharingContract = class MedicalRecordSharingContract extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
        var rid = "record0";
        var option = { Key: "", Value: "", Description: "", Comment: "" };
        var doctorComment = { Comment: "", CommentDate: "", Clinic: "", Division: "", Doctor: "" };
        var record = {
            ID: rid,
            ClinicID: '',
            Clinic: '',
            JobType: '',
            Name: '',
            PID: '',
            Birth: '',
            Sex: '',
            Identity: '',
            Btp: '',
            Address: '',
            Email: '',
            Phone: '',
            CDvin: '',
            CDVinID: '',
            Doctor: '',
            DoctorId: '',
            Did: '',
            Description: '',
            DoctorComment: [doctorComment],
            ConsultationDate: '',
            Options: [option]
        };
        // example of how to write to world state deterministically
        // use convetion of alphabetic order
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
        await ctx.stub.putState(record.ID, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(record))));
        console.info(`Medical record ${record.ID} initialized`);
    }
    // Upload Medical Record issues a new medical record to the world state with given details.
    async UploadMedicalRecord(ctx, txtRecord) {
        var data = JSON.parse(txtRecord);
        console.log(data);
        const exists = await this.MedicalRecordExists(ctx, data.ID);
        if (exists) {
            throw new Error(`The medical record ${data.ID} already exists`);
        }
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(data.ID, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(data))));
    }
    // ReadMedicalRecord returns the medical record stored in the world state with given id.
    async ReadMedicalRecord(ctx, id) {
        const medicalRecordJSON = await ctx.stub.getState(id); // get the medical record from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The record ${id} does not exist`);
        }
        return medicalRecordJSON.toString();
    }
    // UpdateMedicalRecord updates an existing medical record in the world state with provided parameters.
    async UpdateMedicalRecord(ctx, txtRecord) {
        var data = JSON.parse(txtRecord);
        const exists = await this.MedicalRecordExists(ctx, data.ID);
        if (!exists) {
            throw new Error(`The record ${data.ID} does not exist`);
        }
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(data.ID, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(data))));
    }
    // DeleteMedicalRecord deletes an given medical record from the world state.
    async DeleteMedicalRecord(ctx, id) {
        const exists = await this.MedicalRecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The medical record ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }
    // MedicalRecordExists returns true when medical record with given ID exists in world state.
    async MedicalRecordExists(ctx, id) {
        const medicalRecordJSON = await ctx.stub.getState(id);
        return medicalRecordJSON && medicalRecordJSON.length > 0;
    }
    // GetAllMedicalRecords returns all medical record found in the world state.
    async GetAllMedicalRecords(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all medical records in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            }
            catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "InitLedger", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "UploadMedicalRecord", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "ReadMedicalRecord", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "UpdateMedicalRecord", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "DeleteMedicalRecord", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "MedicalRecordExists", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], MedicalRecordSharingContract.prototype, "GetAllMedicalRecords", null);
MedicalRecordSharingContract = __decorate([
    fabric_contract_api_1.Info({ title: 'MedicalRecordSharing', description: 'Smart contract for sharing medical records' })
], MedicalRecordSharingContract);
exports.MedicalRecordSharingContract = MedicalRecordSharingContract;
//# sourceMappingURL=medicalRecordSharing.js.map