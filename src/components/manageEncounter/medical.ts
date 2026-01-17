export interface AllergyEntry {
  date: string;
  time: string;
  description: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  isActive: boolean;
  recordedBy: string;
}

export interface ComplaintEntry {
  date: string;
  time: string;
  description: string;
  isOpen: boolean;
  recordedBy: string;
}

export interface VitalEntry {
  date: string;
  time: string;
  height: string;
  weight: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
}

export interface DiagnosisEntry {
  date: string;
  description: string;
  icdCode?: string;
}

export interface MedicineEntry {
  dateFrom: string;
  dateTo: string;
  name: string;
  dosage: string;
}

export interface LabOrderEntry {
  date: string;
  time: string;
  testName: string;
  status?: string;
}

export interface ProcedureAdviceEntry {
  date: string;
  description: string;
}

export interface PatientInfo {
  patientName: string;
  doctorName: string;
  userName: string;
  date: string;
  time: string;
}

export interface MedicalRecord {
  patientInfo: PatientInfo;
  vitals: VitalEntry[];
  allergies: AllergyEntry[];
  complaints: ComplaintEntry[];
  diagnoses: DiagnosisEntry[];
  medicines: MedicineEntry[];
  labOrders: LabOrderEntry[];
  procedureAdvices: ProcedureAdviceEntry[];
}