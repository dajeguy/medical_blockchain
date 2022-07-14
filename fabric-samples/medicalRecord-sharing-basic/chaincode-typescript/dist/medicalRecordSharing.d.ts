import { Context, Contract } from 'fabric-contract-api';
export declare class MedicalRecordSharingContract extends Contract {
    InitLedger(ctx: Context): Promise<void>;
    UploadMedicalRecord(ctx: Context, txtRecord: string): Promise<void>;
    ReadMedicalRecord(ctx: Context, id: string): Promise<string>;
    UpdateMedicalRecord(ctx: Context, txtRecord: string): Promise<void>;
    DeleteMedicalRecord(ctx: Context, id: string): Promise<void>;
    MedicalRecordExists(ctx: Context, id: string): Promise<boolean>;
    GetAllMedicalRecords(ctx: Context): Promise<string>;
}
