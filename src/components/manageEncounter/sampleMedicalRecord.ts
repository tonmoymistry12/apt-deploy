import { MedicalRecord } from './medical';

export const sampleMedicalRecord: MedicalRecord = {
  patientInfo: {
    patientName: 'Sunny of Ratan Das',
    doctorName: 'Debashis Das',
    userName: localStorage.getItem('userName') || '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  },
  vitals: [],
  allergies: [
    {
      date: '26/08/2025',
      time: '09:00 AM',
      description: 'Penicillin',
      severity: 'Severe',
      isActive: true,
      recordedBy: 'Dr. Smith',
    },
    {
      date: '25/08/2025',
      time: '02:30 PM',
      description: 'Pollen',
      severity: 'Mild',
      isActive: false,
      recordedBy: 'Dr. Jones',
    },
  ],
  complaints: [
    {
      date: '21/08/2025',
      time: '05:23 PM',
      description: 'High fever.',
      isOpen: true,
      recordedBy: 'Debashis Das',
    },
    {
      date: '12/08/2025',
      time: '06:23 PM',
      description: 'Cough and cold.',
      isOpen: false,
      recordedBy: 'Debashis Das',
    },
  ],
  diagnoses: [
    {
      date: '21/08/2025',
      description: 'Antenatal Screening For Fetal Growth Retardation Using Ultrasonics',
      icdCode: 'ICD : V28.4',
    },
    {
      date: '12/08/2025',
      description: 'Encounter for routine screening for malformation using ultrasonics',
      icdCode: 'ICD : V28.3',
    },
  ],
  medicines: [
    {
      dateFrom: '21/08/2025',
      dateTo: '22/08/2025',
      name: 'NILUP P 100 MG/500 MG',
      dosage: 'TABLET',
    },
    {
      dateFrom: '12/08/2025',
      dateTo: '12/08/2025',
      name: 'TRIOFLAM 100 MG/500 MG/15 MG',
      dosage: 'TABLET',
    },
  ],
  labOrders: [
    {
      date: '21/08/2025',
      time: '05:24 PM',
      testName: 'Direct antiglobulin test.IgG specific reagent [Interpretation] on Red Blood Cells',
    },
    {
      date: '12/08/2025',
      time: '06:27 PM',
      testName: 'Direct antiglobulin test.complement specific reagent [Presence] on Red Blood Cells',
    },
  ],
  procedureAdvices: [
    {
      date: '21/08/2025',
      description: 'Ultrasound Therapy of Other Vessels, Single',
    },
    {
      date: '12/08/2025',
      description: 'Extracorporeal Therapies, Physiological Systems, Ultrasound Therapy',
    },
  ],
};