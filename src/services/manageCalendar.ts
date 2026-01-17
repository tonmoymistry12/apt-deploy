import http from '@/common/http';

interface CheckDayAvailabilityPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  startDate: string;
  stopDate: string;
}

interface CheckDayAvailabilityResponse {
  message: string;
  status: string;
}

interface CheckDuplicateSlotPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: number;
  facilityId: number;
  slotId: number;
  startDate: string;
  stopDate: string;
}

interface CheckDuplicateSlotResponse {
  message: string;
  status: string;
}

interface AddSlotPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  facilityId: number;
  bookAppType: string;
  checkedDay: string;
  dayTime: string;
  startDate: string;
  stopDate: string;
  slotDuration: string;
  slotDuration2: string;
  slotId?: string; // Optional for edit case
}

interface AddSlotResponse {
  message: string;
  status: string;
}

export interface GetDoctorSlotsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string | undefined;
  facilityId: string;
}

export interface GetDoctorSlotsResponse {
  status: string;
  message?: string;
  data?: any;
}

export const checkDayAvailability = async (payload: CheckDayAvailabilityPayload,doctorUID:any = null): Promise<CheckDayAvailabilityResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: doctorUID ? doctorUID.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<CheckDayAvailabilityResponse>('/checkdayavailability', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateSlot = async (payload: CheckDuplicateSlotPayload, doctorUID:any = null): Promise<CheckDuplicateSlotResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: doctorUID ? doctorUID.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<CheckDuplicateSlotResponse>('/checkduplicateslot', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addSlot = async (payload: AddSlotPayload, doctorUid: any = null): Promise<AddSlotResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: doctorUid ? doctorUid.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<AddSlotResponse>('/addslot', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getdoctorSlots = async (payload: GetDoctorSlotsPayload, doctorUid:any = null): Promise<GetDoctorSlotsResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      orgId: localStorage.getItem("orgId") || "",
      doctorUId: doctorUid ? doctorUid.userUid : localStorage.getItem("doctorUid"),
     }
     
    const { data } = await http.post<GetDoctorSlotsResponse>('/getdoctorslots', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

interface GetEditSlotDataPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  slotId: number;
}

interface GetEditSlotDataResponse {
  slotDuration: string;
  slotDuration2: string;
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  checkedDay: string | null;
  dayTime: string | null;
  startDate: string | null;
  stopDate: string | null;
  orgStrDtTmStr: string | null;
  orgStpDtTmStr: string | null;
  facilityName: string | null;
  docName: string | null;
  patientName: string | null;
  gender: string | null;
  appointmentStatus: string | null;
  changeStatus: string | null;
  regStatus: string | null;
  eventDates: string | null;
  eventIds: string | null;
  scheduleStartDt: string;
  scheduleStopDt: string;
  orgStartDate: string | null;
  orgStopDate: string | null;
  isTodaysAppointment: string | null;
  sundayStartTime1: string;
  sundayStartTime2: string;
  mondayStartTime1: string;
  mondayStartTime2: string;
  tuesdayStartTime1: string;
  tuesdayStartTime2: string;
  saturdayStartTime1: string;
  wednesdayStartTime1: string;
  wednesdayStartTime2: string;
  thursdayStartTime1: string;
  thursdayStartTime2: string;
  fridayStartTime1: string;
  fridayStartTime2: string;
  saturdayStartTime2: string;
  sundayStopTime1: string;
  sundayStopTime2: string;
  mondayStopTime1: string;
  mondayStopTime2: string;
  tuesdayStopTime1: string;
  tuesdayStopTime2: string;
  saturdayStopTime1: string;
  wednesdayStopTime1: string;
  wednesdayStopTime2: string;
  thursdayStopTime1: string;
  thursdayStopTime2: string;
  fridayStopTime1: string;
  fridayStopTime2: string;
  saturdayStopTime2: string;
  bookAppType: string;
  startTime: string | null;
  stopTime: string | null;
  appStartDateTime: string | null;
  appStopDateTime: string | null;
  slotDurationMinutes: string | null;
  noteMessage: string | null;
  noteType: string | null;
  zoomMeetingUrl: string | null;
  petName: string | null;
  meetingUrl: string | null;
  patientEmail: string | null;
  doctorEmail: string | null;
  consultationType: string | null;
  facilityType: string | null;
  callingFrom: string | null;
  slotSequence: number;
  retVal: number;
  slotIndex: number;
  sundayAvailable: number;
  mondayAvailable: number;
  tuesdayAvailable: number;
  wednesdayAvailable: number;
  thursdayAvailable: number;
  fridayAvailable: number;
  saturdayAvailable: number;
  age: number;
  activeInd: number;
  prescriptionCount: number;
  documentCount: number;
  teleConsultationStartByVetInd: number;
  patientUid: number;
  patientMrn: string | null;
  appointmentId: string | null;
  encounterId: string | null;
  doctorUId: string | null;
  slotId: number;
  facilityId: number;
  orgId: number;
  orgUserId: number;
  insertUserId: string | null;
  updateUserId: string | null;
  summaryId: string | null;
  noOfPatients: number;
  appCount: string | null;
  petOwnerUid: string | null;
  uploadedDocumentsList: string | null;
  uploadedPrescriptionsList: string | null;
  loggedInFacilityId: number;
}

export const getEditSlotData = async (payload: GetEditSlotDataPayload): Promise<GetEditSlotDataResponse> => {
  try {

    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<GetEditSlotDataResponse>('/geteditslotdata', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const editSlot = async (payload: AddSlotPayload): Promise<AddSlotResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
    //  doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<AddSlotResponse>('/editslot', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

interface TemporaryAdjustCalendarPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  startDate: string;
  stopDate: string;
  orgId: string | undefined;
  facilityId: number;
  dayTime: string;
  slotDuration: string;
  slotDuration2: string;
  bookAppType: string;
  slotId: string;
  notAvailableFirstSlot: string;
  notAvailableSecondSlot: string;
}

interface TemporaryAdjustCalendarResponse {
  message: string;
  status: string;
}

export const temporaryAdjustCalendar = async (payload: TemporaryAdjustCalendarPayload): Promise<TemporaryAdjustCalendarResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
     // doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<TemporaryAdjustCalendarResponse>('/temporaryadjustcalendar', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

interface GetSlotDatesPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  facilityId: number;
}

interface GetSlotDatesResponse {
  available: string;
  notavailable: string;
  fullavailable: string;
  status: string;
}

export const getSlotDates = async (payload: GetSlotDatesPayload, docotorUid:any = null): Promise<GetSlotDatesResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      orgId: localStorage.getItem("orgId") || "",
      doctorUId: docotorUid ? docotorUid.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<GetSlotDatesResponse>('/getslotdates', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

interface ViewPatientsInSlotPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  loggedInFacilityId: number;
  orgId: number;
  facilityId: number;
  slotIndex: number;
  startDate: string;
}

interface PatientSlot {
  slotDuration: string | null;
  slotDuration2: string | null;
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  checkedDay: string | null;
  dayTime: string | null;
  startDate: string | null;
  stopDate: string | null;
  orgStrDtTmStr: string;
  orgStpDtTmStr: string;
  facilityName: string | null;
  docName: string | null;
  patientName: string | null;
  gender: string | null;
  appointmentStatus: string | null;
  changeStatus: string | null;
  regStatus: string | null;
  eventDates: string | null;
  eventIds: string | null;
  scheduleStartDt: string | null;
  scheduleStopDt: string | null;
  orgStartDate: string | null;
  orgStopDate: string | null;
  isTodaysAppointment: string | null;
  sundayStartTime1: string | null;
  sundayStartTime2: string | null;
  mondayStartTime1: string | null;
  mondayStartTime2: string | null;
  tuesdayStartTime1: string | null;
  tuesdayStartTime2: string | null;
  saturdayStartTime1: string | null;
  wednesdayStartTime1: string | null;
  wednesdayStartTime2: string | null;
  thursdayStartTime1: string | null;
  thursdayStartTime2: string | null;
  fridayStartTime1: string | null;
  fridayStartTime2: string | null;
  saturdayStartTime2: string | null;
  sundayStopTime1: string | null;
  sundayStopTime2: string | null;
  mondayStopTime1: string | null;
  mondayStopTime2: string | null;
  tuesdayStopTime1: string | null;
  tuesdayStopTime2: string | null;
  saturdayStopTime1: string | null;
  wednesdayStopTime1: string | null;
  wednesdayStopTime2: string | null;
  thursdayStopTime1: string | null;
  thursdayStopTime2: string | null;
  fridayStopTime1: string | null;
  fridayStopTime2: string | null;
  saturdayStopTime2: string | null;
  bookAppType: string;
  startTime: string;
  stopTime: string;
  appStartDateTime: string | null;
  appStopDateTime: string | null;
  slotDurationMinutes: string | null;
  noteMessage: string | null;
  noteType: string | null;
  zoomMeetingUrl: string | null;
  petName: string | null;
  meetingUrl: string | null;
  patientEmail: string | null;
  doctorEmail: string | null;
  consultationType: string | null;
  facilityType: string | null;
  callingFrom: string | null;
  slotSequence: number;
  retVal: number;
  slotIndex: number;
  sundayAvailable: number;
  mondayAvailable: number;
  tuesdayAvailable: number;
  wednesdayAvailable: number;
  thursdayAvailable: number;
  fridayAvailable: number;
  saturdayAvailable: number;
  age: number;
  activeInd: number;
  prescriptionCount: number;
  documentCount: number;
  teleConsultationStartByVetInd: number;
  patientUid: number;
  patientMrn: number | null;
  appointmentId: number | null;
  encounterId: number | null;
  doctorUId: number | null;
  slotId: number | null;
  facilityId: number | null;
  orgId: number | null;
  orgUserId: number | null;
  insertUserId: number | null;
  updateUserId: number | null;
  summaryId: number;
  noOfPatients: number;
  appCount: number | null;
  petOwnerUid: number | null;
  uploadedDocumentsList: string | null;
  uploadedPrescriptionsList: string | null;
  loggedInFacilityId: number;
}

export const viewPatientsInSlot = async (payload: ViewPatientsInSlotPayload, docotorUid:any = null): Promise<PatientSlot[]> => {
  try {
     let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: docotorUid ? docotorUid.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<PatientSlot[]>('/viewpatientsinslot', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export interface SearchApptPatientPayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
  idProofType: string;
  orgId: string;
  searchValue1: string;
  searchValue2: string;
}

export interface SearchApptPatientResponse {
  ageOrDob: string | null;
  address1: string | null;
  address2: string | null;
  appointmentExist: string | null;
  birthDt: string | null;
  bloodGrp: string | null;
  cellNumber: string;
  city: string | null;
  country: string | null;
  contactNo: string | null;
  createdOn: string | null;
  creationDt: string;
  corporateExpDate: string | null;
  deviceStat: string | null;
  dob: string | null;
  ethnicity: string | null;
  email: string;
  firstName: string;
  fullName: string | null;
  gender: string;
  ownerGender: string | null;
  hasDocument: string | null;
  hasEncounterHistory: string | null;
  idProofType: string | null;
  idProofValue: string | null;
  imageFilePath: string | null;
  imageFileName: string | null;
  ownerImageFileName: string | null;
  image: string | null;
  insurerExpDate1: string | null;
  insurerExpDate2: string | null;
  insurerExpDate3: string | null;
  lastName: string;
  lastActivityOn: string | null;
  lastUpdatedOn: string | null;
  middleName: string | null;
  nationality: string | null;
  occupation: string | null;
  patientTitle: string;
  pin: string | null;
  patEmail: string | null;
  pendingChargeMessages: string;
  religion: string | null;
  regStatus: string;
  state: string | null;
  searchValue1: string | null;
  searchValue2: string | null;
  title: string | null;
  userName: string;
  userPwd: string;
  updateDt: string;
  verificationLink: string | null;
  petName: string;
  linkedInId: string | null;
  petType: string | null;
  petsDiet: string | null;
  livingEnvironment: string | null;
  trainingDone: string | null;
  petCategory: string | null;
  petDetails: string | null;
  petHistory: string | null;
  areaName: string | null;
  clinicJoiningDate: string | null;
  petBreed: string | null;
  petCoverImageFileName: string | null;
  activeInd: number;
  age: number;
  cityPincodeMappingId: number | null;
  createdByUserId: number;
  corpId: number;
  insurerId1: number;
  insurerId2: number;
  insurerId3: number;
  lastUpdatedByUserId: number;
  mrn: number;
  orgId: number;
  patientUid: number;
  updateByUserId: number;
  petOwnerUid: number;
}

export const searchApptPatient = async (payload: SearchApptPatientPayload): Promise<SearchApptPatientResponse[] | { message: string; status: string }> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      //doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<SearchApptPatientResponse[] | { message: string; status: string }>('/searchapptpatient', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Add Home Visit API interfaces and function
interface PreferredDaySlot {
  day: string;
  slot_1: {
    start_time: string;
    end_time: string;
  };
  slot_2: {
    start_time: string;
    end_time: string;
  };
}

interface AddHomeVisitPayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
  orgId: string | undefined;
  preferredDaysSlots: PreferredDaySlot[];
  homeVisit: string;
  emergencyRequest: string;
}

interface AddHomeVisitResponse {
  message: string;
  status: string;
}

export const addHomeVisit = async (payload: AddHomeVisitPayload): Promise<AddHomeVisitResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorMasterId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<AddHomeVisitResponse>('/addhomevisit', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Home Visit Data API interfaces and function
interface GetHomeVisitDataPayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
}

interface GetHomeVisitDataResponse {
  homeVisit: boolean;
  emergencyRequest: boolean;
  preferredDaysSlots: PreferredDaySlot[];
  homeVisitAppointments: any;
}

export const getHomeVisitData = async (payload: GetHomeVisitDataPayload): Promise<GetHomeVisitDataResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorMasterId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<GetHomeVisitDataResponse>('/gethomevisitdata', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Home Visit Appointments API interfaces and function
interface GetHomeVisitAppointmentsPayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
  appointmentFilter: 'all' | 'future';
}

interface HomeVisitAppointment {
  homeVisitAppointmentId: number;
  petOwnerUid: number;
  patientUid: number;
  slot: number;
  homeVisitStartTime: string;
  homeVisitEndTime: string;
  homeVisitCause: 'emergency' | 'routine';
  petGender: string;
  petCategory: string | null;
  address: string;
  petAndOwnerName: string;
  petImageFileName: string;
  ownerImageFileName: string;
}

interface GetHomeVisitAppointmentsResponse {
  homeVisit: boolean;
  emergencyRequest: boolean;
  preferredDaysSlots: PreferredDaySlot[] | null;
  homeVisitAppointments: HomeVisitAppointment[];
}

export const getHomeVisitAppointments = async (payload: GetHomeVisitAppointmentsPayload): Promise<GetHomeVisitAppointmentsResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorMasterId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<GetHomeVisitAppointmentsResponse>('/gethomevisitappointments', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update Home Visit API interfaces and function
interface UpdateHomeVisitPayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
  orgId: string | undefined;
  preferredDaysSlots: PreferredDaySlot[];
  homeVisit: string;
  emergencyRequest: string;
}

interface UpdateHomeVisitResponse {
  message: string;
  status: string;
}

export const updateHomeVisit = async (payload: UpdateHomeVisitPayload): Promise<UpdateHomeVisitResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorMasterId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<UpdateHomeVisitResponse>('/updatehomevisit', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Matching Home Visit Slot Timings API interfaces and function
interface GetMatchingHomeVisitSlotTimingsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  checkedDay: string; // Format: "2025-09-04"
}

interface HomeVisitSlotTiming {
  homeVisitAppointmentId: number;
  petOwnerUid: number;
  patientUid: number;
  slot: number;
  homeVisitStartTime: string;
  homeVisitEndTime: string;
  homeVisitCause: 'emergency' | 'routine';
  petGender: string | null;
  petCategory: string | null;
  address: string | null;
  petAndOwnerName: string | null;
  petImageFileName: string | null;
  ownerImageFileName: string | null;
}

export const getMatchingHomeVisitSlotTimings = async (payload: GetMatchingHomeVisitSlotTimingsPayload): Promise<HomeVisitSlotTiming[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<HomeVisitSlotTiming[]>('/getmatchinghomevisitslottimings', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Cancel Home Visit Appointment API interfaces and function
interface CancelHomeVisitAppointmentPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  appointmentId: number;
  petOwnerUid: number;
  patientUid: number;
}

interface CancelHomeVisitAppointmentResponse {
  message: string;
  status: string;
}

export const cancelHomeVisitAppointment = async (payload: CancelHomeVisitAppointmentPayload): Promise<CancelHomeVisitAppointmentResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<CancelHomeVisitAppointmentResponse>('/cancelhomevisitappointment', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Upload Voice Prescription API interfaces and function
interface UploadVoicePrescriptionPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  patientId: number;
  appointmentId: number;
  publicNote: string;
}

interface UploadVoicePrescriptionResponse {
  message: string;
  status: string;
}

export const uploadVoicePrescription = async (payload: UploadVoicePrescriptionPayload): Promise<UploadVoicePrescriptionResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || "",
      orgId: localStorage.getItem("orgId") || "",

     }
    const { data } = await http.post<UploadVoicePrescriptionResponse>('/uploadvoiceprescription', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Voice Prescriptions API interfaces and function
interface GetVoicePrescriptionsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  appointmentId: number;
}

interface VoicePrescription {
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  savedFileName: string | null;
  prescriptionName: string | null;
  documentDate: string | null;
  patientName: string | null;
  documentType: string | null;
  publicNote: string;
  publicNoteDate: string;
  publicNoteTime: string;
  prescriptionId: number;
  orgId: number;
  patientId: number;
  patientUid: number;
  encounterId: number;
  appointmentId: number;
  encounterPublicNoteId: number;
}

export const getVoicePrescriptions = async (payload: GetVoicePrescriptionsPayload): Promise<VoicePrescription[]> => {
  try {
    let fixPaylod = {
      ...payload,
      orgId: localStorage.getItem("orgId") || "",
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      //doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<VoicePrescription[]>('/getvoiceprescriptions', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Pet Profile API interfaces and function
interface GetPetProfilePayload {
  userName: string;
  userPwd: string;
  deviceStat: string;
  patientUid: number;
}

interface PetDocument {
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  savedFileName: string;
  documentName: string;
  documentDate: string;
  patientName: string | null;
  documentType: string;
  documentId: number;
  orgId: number;
  patientId: number;
  patientUid: number;
  appointmentId: number;
}

interface GetPetProfileResponse {
  ageOrDob: string | null;
  address1: string;
  address2: string;
  appointmentExist: string | null;
  birthDt: string;
  bloodGrp: string | null;
  cellNumber: string;
  city: string;
  country: string;
  contactNo: string | null;
  createdOn: string | null;
  creationDt: string;
  corporateExpDate: string | null;
  deviceStat: string | null;
  dob: string | null;
  ethnicity: string | null;
  email: string;
  firstName: string;
  fullName: string | null;
  gender: string;
  ownerGender: string;
  hasDocument: string | null;
  hasEncounterHistory: string | null;
  idProofType: string | null;
  idProofValue: string | null;
  imageFilePath: string | null;
  imageFileName: string;
  ownerImageFileName: string | null;
  image: string | null;
  insurerExpDate1: string | null;
  insurerExpDate2: string | null;
  insurerExpDate3: string | null;
  lastName: string;
  lastActivityOn: string | null;
  lastUpdatedOn: string | null;
  middleName: string | null;
  nationality: string | null;
  occupation: string | null;
  patientTitle: string;
  pin: string;
  patEmail: string | null;
  pendingChargeMessages: string;
  religion: string | null;
  regStatus: string | null;
  state: string;
  searchValue1: string | null;
  searchValue2: string | null;
  title: string | null;
  userName: string;
  userPwd: string | null;
  updateDt: string;
  verificationLink: string | null;
  petName: string;
  linkedInId: string;
  petType: string;
  petsDiet: string;
  livingEnvironment: string;
  trainingDone: string;
  petCategory: string;
  petCategoryOther: string | null;
  petDetails: string;
  petHistory: string;
  areaName: string;
  clinicJoiningDate: string;
  petBreed: string;
  petCoverImageFileName: string;
  trainingSchool: string;
  trainer: string;
  trainingDetails: string;
  activeInd: number;
  age: number;
  cityPincodeMappingId: number;
  createdByUserId: number;
  corpId: number;
  insurerId1: number;
  insurerId2: number;
  insurerId3: number;
  lastUpdatedByUserId: number;
  mrn: number;
  orgId: number;
  orgUserId: number;
  patientUid: number;
  updateByUserId: number;
  petOwnerUid: number;
  cityId: number;
  loggedInFacilityId: number;
  uploadedDocumentsList: PetDocument[];
  uploadedPrescriptionsList: any[];
}

export const getPetProfile = async (payload: GetPetProfilePayload): Promise<GetPetProfileResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<GetPetProfileResponse>('/getpetprofile', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update Status Arrive API
interface UpdateStatusArrivePayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: number;
  facilityId: number;
  patientMrn: string;
  petOwnerUid: string;
  patientUid: string;
  appointmentId: string;
  appointmentStatus: string;
  changeStatus: string;
  meetingUrl: string;
}

interface UpdateStatusArriveResponse {
  message: string;
  status: string;
  encounterId: string;
}

export const updateStatusArrive = async (payload: UpdateStatusArrivePayload): Promise<UpdateStatusArriveResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<UpdateStatusArriveResponse>('/updatestatusarrive', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update Consultation Started API
interface UpdateConsultationStartedPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string;
  facilityId: string;
  patientMrn: string;
  petOwnerUid: string;
  patientUid: string;
  appointmentId: string;
  appointmentStatus: string;
  changeStatus: string;
  consultationType: string;
  meetingUrl: string;
}

interface UpdateConsultationStartedResponse {
  message: string;
  status: string;
}

export const updateConsultationStarted = async (payload: UpdateConsultationStartedPayload): Promise<UpdateConsultationStartedResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<UpdateConsultationStartedResponse>('/updateconsultationstarted', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update Status Complete API
interface UpdateStatusCompletePayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: number;
  facilityId: number;
  patientMrn: string;
  petOwnerUid: string;
  patientUid: string;
  appointmentId: string;
  encounterId: string;
  appointmentStatus: string;
  changeStatus: string;
}

interface UpdateStatusCompleteResponse {
  message: string;
  status: string;
}

export const updateStatusComplete = async (payload: UpdateStatusCompletePayload): Promise<UpdateStatusCompleteResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: localStorage.getItem("doctorUid") || ""
     }
    const { data } = await http.post<UpdateStatusCompleteResponse>('/updatestatuscomplete', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};


// Pet Owner and Pet List APIs
export interface GetPetOwnerListPayload {
  callingFrom: string;
  userName: string;
  userPwd: string;
  deviceStat: string;
  orgId: number;
}

export interface PetOwnerResponse {
  firstName: string;
  lastName: string;
  cellNumber: string;
  email: string;
  petOwnerUid: number;
  mrn: number;
  patientUid: number;
}

export interface GetPetListPayload {
  callingFrom: string;
  userName: string;
  userPwd: string;
  deviceStat: string;
  orgId: number;
  petOwnerUid: number;
}

export interface PetResponse {
  petName: string;
  petOwnerUid: number;
  patientUid: number;
  mrn: number;
}

export const getPetOwnerList = async (payload: GetPetOwnerListPayload): Promise<PetOwnerResponse[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || ""
     }
    const { data } = await http.post<PetOwnerResponse[]>('/getpetownerlist', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPetList = async (payload: GetPetListPayload): Promise<PetResponse[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || ""
     }
    const { data } = await http.post<PetResponse[]>('/getpetlist', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Save Appointment API
export interface SaveAppointmentPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string;
  facilityId: number;
  bookAppType: string;
  apptSelDate: string;
  startTime: string;
  stopTime: string;
  episode: string;
  petOwnerUid: string;
  patientUid: string;
  patientId: number;
}

export interface SaveAppointmentResponse {
  message: string;
  status: string;
}

export const saveAppointment = async (payload: SaveAppointmentPayload, doctorUID:any = null): Promise<SaveAppointmentResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: doctorUID ? doctorUID.userUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<SaveAppointmentResponse>('/saveappointment', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Uploaded Documents API
export interface GetUploadedDocumentsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  patientUid: string;
}

export interface UploadedDocument {
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  savedFileName: string;
  documentName: string;
  documentDate: string;
  patientName: string | null;
  documentType: string;
  documentId: number;
  orgId: number;
  patientId: number;
  patientUid: number;
  appointmentId: number;
}

export const getUploadedDocuments = async (payload: GetUploadedDocumentsPayload): Promise<UploadedDocument[] | { message: string; status: string }> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<UploadedDocument[] | { message: string; status: string }>('/getuploadeddocuments', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Document Type List API
export interface GetDocumentTypeListPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
}

export interface DocumentTypeResponse {
  docTypeId: number;
  docTypeShortName: string;
  docTypeDetailName: string;
}

export const getDocumentTypeList = async (payload: GetDocumentTypeListPayload): Promise<DocumentTypeResponse[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<DocumentTypeResponse[]>('/getdocumenttypelist', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Upload Document API
export interface UploadDocumentPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  docname: string;
  docdate: string; // DD/MM/YYYY format
  select_doctype_list: string; // docTypeId as string
  patientUid: string;
  appointmentId: string; // "0" if not for specific appointment
  uploaded_file: File;
}

export interface UploadDocumentResponse {
  message: string;
  status: string;
}

export const uploadDocument = async (payload: UploadDocumentPayload): Promise<{ data: UploadDocumentResponse; status: number }> => {
  try {
    const formData = new FormData();
    formData.append('userName', payload.userName);
    formData.append('userPass', payload.userPass);
    formData.append('deviceStat', payload.deviceStat);
    formData.append('docname', payload.docname);
    formData.append('docdate', payload.docdate);
    formData.append('select_doctype_list', payload.select_doctype_list);
    formData.append('patientUid', payload.patientUid);
    formData.append('appointmentId', payload.appointmentId);
    formData.append('uploaded_file', payload.uploaded_file);
    formData.append('loggedInFacilityId', localStorage.getItem("loggedinFacilityId") || "");
    formData.append('orgId', localStorage.getItem("orgId") || "");

    const response = await http.post<UploadDocumentResponse>('/uploaddocument', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    // If error has response, return it with status, otherwise throw
    if (error.response) {
      return { data: error.response.data, status: error.response.status };
    }
    throw error;
  }
};

// Remove Document API
export interface RemoveDocumentPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  documentId: string;
  patientUid: string;
}

export interface RemoveDocumentResponse {
  message: string;
  status: string;
  statusCode: string;
}

export const removeDocument = async (payload: RemoveDocumentPayload): Promise<RemoveDocumentResponse> => {
  try {
    
let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<RemoveDocumentResponse>('/removedocument', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Share with Doctor API
export interface ShareWithDocPayload {
  userName: string;
  password: string;
  deviceStat: string;
  sharefileId: string;
  docList: string[];
}

export interface ShareWithDocResponse {
  message: string;
  status: string;
}

export const shareWithDoc = async (payload: ShareWithDocPayload): Promise<ShareWithDocResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }
    const { data } = await http.post<ShareWithDocResponse>('/sharewithdoc', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get Selected Day Slots API (for temp adjustment prefill)
export interface GetSelectedDaySlotsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  startDate: string; // Format: DD/MM/YYYY - selected date from calendar
  orgId: string;
  facilityId: number;
}

export interface GetSelectedDaySlotsResponse {
  slotDuration: string;
  slotDuration2: string;
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  checkedDay: string | null;
  dayTime: string | null;
  startDate: string | null;
  stopDate: string | null;
  orgStrDtTmStr: string | null;
  orgStpDtTmStr: string | null;
  facilityName: string | null;
  docName: string | null;
  patientName: string | null;
  gender: string | null;
  appointmentStatus: string | null;
  changeStatus: string | null;
  regStatus: string | null;
  eventDates: string | null;
  eventIds: string | null;
  scheduleStartDt: string | null;
  scheduleStopDt: string | null;
  orgStartDate: string | null;
  orgStopDate: string | null;
  isTodaysAppointment: string | null;
  sundayStartTime1: string | null;
  sundayStartTime2: string | null;
  mondayStartTime1: string | null;
  mondayStartTime2: string | null;
  tuesdayStartTime1: string | null;
  tuesdayStartTime2: string | null;
  saturdayStartTime1: string | null;
  wednesdayStartTime1: string | null;
  wednesdayStartTime2: string | null;
  thursdayStartTime1: string | null;
  thursdayStartTime2: string | null;
  fridayStartTime1: string | null;
  fridayStartTime2: string | null;
  saturdayStartTime2: string | null;
  sundayStopTime1: string | null;
  sundayStopTime2: string | null;
  mondayStopTime1: string | null;
  mondayStopTime2: string | null;
  tuesdayStopTime1: string | null;
  tuesdayStopTime2: string | null;
  saturdayStopTime1: string | null;
  wednesdayStopTime1: string | null;
  wednesdayStopTime2: string | null;
  thursdayStopTime1: string | null;
  thursdayStopTime2: string | null;
  fridayStopTime1: string | null;
  fridayStopTime2: string | null;
  saturdayStopTime2: string | null;
  bookAppType: string;
  startTime: string | null;
  stopTime: string | null;
  appStartDateTime: string | null;
  appStopDateTime: string | null;
  slotDurationMinutes: string | null;
  noteMessage: string | null;
  noteType: string | null;
  zoomMeetingUrl: string | null;
  petName: string | null;
  meetingUrl: string | null;
  patientEmail: string | null;
  doctorEmail: string | null;
  consultationType: string | null;
  facilityType: string | null;
  slotSequence: number;
  retVal: number;
  slotIndex: number;
  sundayAvailable: number;
  mondayAvailable: number;
  tuesdayAvailable: number;
  wednesdayAvailable: number;
  thursdayAvailable: number;
  fridayAvailable: number;
  saturdayAvailable: number;
  age: number;
  activeInd: number;
  prescriptionCount: number;
  documentCount: number;
  teleConsultationStartByVetInd: number;
  patientUid: number;
  patientMrn: string | null;
  appointmentId: string | null;
  encounterId: string | null;
  doctorUId: string | null;
  slotId: number;
  facilityId: number | null;
  orgId: number | null;
  orgUserId: number | null;
  insertUserId: string | null;
  updateUserId: string | null;
  summaryId: string | null;
  noOfPatients: number;
  appCount: string | null;
  petOwnerUid: string | null;
  uploadedDocumentsList: string | null;
  uploadedPrescriptionsList: string | null;
}

export const getSelectedDaySlots = async (payload: GetSelectedDaySlotsPayload, docotorUid : any = null): Promise<GetSelectedDaySlotsResponse> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      doctorUId: docotorUid ? docotorUid : localStorage.getItem("doctorUid"),
     }
    const { data } = await http.post<GetSelectedDaySlotsResponse>('/getselecteddayslots', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};
