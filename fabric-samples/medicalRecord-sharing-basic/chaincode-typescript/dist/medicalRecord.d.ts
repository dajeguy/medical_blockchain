import { OptionModel } from './OptionModel';
import { DoctorComment } from './DoctorComment';
export declare class MedicalRecord {
    ID: string;
    ClinicID: string;
    Clinic: string;
    JobType: string;
    Name: string;
    PID: string;
    Birth: string;
    Sex: string;
    Btp: string;
    Identity: string;
    CDvin: string;
    CDVinID: string;
    Description: string;
    Doctor: string;
    DoctorId: string;
    Did: string;
    Address: string;
    Email: string;
    Phone: string;
    DoctorComment: DoctorComment[];
    ConsultationDate: string;
    Options: OptionModel[];
}
