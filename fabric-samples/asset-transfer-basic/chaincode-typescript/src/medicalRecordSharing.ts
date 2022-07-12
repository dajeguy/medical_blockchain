/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {MedicalRecord} from './medicalRecord';
import {OptionModel} from './OptionModel';
import {DoctorComment} from './DoctorComment';

@Info({title: 'MedicalRecordSharing', description: 'Smart contract for sharing medical records'})
export class MedicalRecordSharingContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        var rid = "record0";
        var option = {Key:"",Value:"",Description:"",Comment:""} as OptionModel;
        var doctorComment = { Comment: "",CommentDate:"", Clinic:"",Division:"",Doctor:""} as DoctorComment;
        var record: MedicalRecord = {
                ID: rid,
                ClinicID: '',
                Clinic:'',
                JobType: '',
                Name: '',
                PID: '',
                Birth: '',
                Sex: '',
                Identity:'',
                Btp: '',
                Address: '',
                Email: '',
                Phone: '',
                CDvin: '',
                CDVinID: '',
                Doctor: '',
                DoctorId:'',
                Did:'',
                Description: '',
                DoctorComment: [doctorComment],
                ConsultationDate:'',
                Options:[option]
            };

            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(record.ID, Buffer.from(stringify(sortKeysRecursive(record))));
            console.info(`Medical record ${record.ID} initialized`);
    }

    // Upload Medical Record issues a new medical record to the world state with given details.
    @Transaction()
    public async UploadMedicalRecord(ctx: Context, txtRecord: string): Promise<void> {
        var data = JSON.parse(txtRecord);
        console.log(data);

        const exists = await this.MedicalRecordExists(ctx, data.ID);
        if (exists) {
            throw new Error(`The medical record ${data.ID} already exists`);
        }
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(data.ID, Buffer.from(stringify(sortKeysRecursive(data))));
    }

    // ReadMedicalRecord returns the medical record stored in the world state with given id.
    @Transaction(false)
    public async ReadMedicalRecord(ctx: Context, id: string): Promise<string> {
        const medicalRecordJSON = await ctx.stub.getState(id); // get the medical record from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The record ${id} does not exist`);
        }
        return medicalRecordJSON.toString();
    }

    // UpdateMedicalRecord updates an existing medical record in the world state with provided parameters.
    @Transaction()
    public async UpdateMedicalRecord(ctx: Context, txtRecord: string): Promise<void> {
        var data = JSON.parse(txtRecord);
        const exists = await this.MedicalRecordExists(ctx, data.ID);
        if (!exists) {
            throw new Error(`The record ${data.ID} does not exist`);
        }

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(data.ID, Buffer.from(stringify(sortKeysRecursive(data))));
    }

    // DeleteMedicalRecord deletes an given medical record from the world state.
    @Transaction()
    public async DeleteMedicalRecord(ctx: Context, id: string): Promise<void> {
        const exists = await this.MedicalRecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The medical record ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // MedicalRecordExists returns true when medical record with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async MedicalRecordExists(ctx: Context, id: string): Promise<boolean> {
        const medicalRecordJSON = await ctx.stub.getState(id);
        return medicalRecordJSON && medicalRecordJSON.length > 0;
    }


    // GetAllMedicalRecords returns all medical record found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllMedicalRecords(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all medical records in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

}
