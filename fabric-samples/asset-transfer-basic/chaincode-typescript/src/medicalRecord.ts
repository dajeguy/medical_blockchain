/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';
import{OptionModel} from './OptionModel';
import{DoctorComment} from './DoctorComment';


export class MedicalRecord {
    public ID: string;
    public ClinicID: string;
    public Clinic: string;
    public JobType: string;
    public Name: string;
    public PID: string;
    public Birth: string;
    public Sex: string;
    public Btp: string;
    public Identity: string;
    public CDvin: string;
    public CDVinID: string;
    public Description: string;
    public Doctor: string;
    public DoctorId:string;
    public Did:string;
    public Address: string;
    public Email: string;
    public Phone: string;
    public DoctorComment: DoctorComment[];
    public ConsultationDate: string;
    public Options: OptionModel[];

}
