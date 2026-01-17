export interface FaclityServicePayload {
    userName:string;
    userPass:string;
    deviceStat:string;
    callingFrom:string;
    searchFacility: string;
    status: string;
    orgId?:string;
  }
  
  export interface FaclityServiceResponse {
      facilityColor: string;
      patientsToView: number;
      internBilling: number;
      facilityId: number;
      facilityTypeId: number,
      orgId: number;
      loggedInFacilityId: number;
      orgUserId: number;
      cityPincodeMappingId: number | string;
      cityId: number;
      facilityName: string;
      contactPersonName: string | null;
      address1: string;
      address2: string;
      pin: string;
      state: string;
      country: string;
      firstContactNo: string;
      firstContactEmail: string;
      secondContactNo: string | null;
      secondContactEmail: string | null;
      city: string | null;
      userName: string | null;
      userPass: string | null;
      deviceStat: string | null;
      areaName: string | null;
      status: string | null;
      facilityType: string;
      callingFrom: string | null;
    }

export interface GetFacilityDetailsPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  callingFrom: string;
  orgId: string;
  facilityId: string;
}

export interface AddNewFacilityPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string;
  loggedInFacilityId: string;
  facilityId: string;
  status: number;
  facilityName: string;
  address1: string;
  address2: string;
  pin: string;
  state: string;
  country: string;
  city: string;
  firstContactEmail: string;
  firstContactNo: string;
  secondContactEmail: string;
  secondContactNo: string;
  orgUserId: string;
  contactPersonName: string;
  cityPincodeMappingId: string;
  areaName: string;
  cityId: string;
  facilityTypeId: string;
  facilityType: string;
  patientsToView: string;
  internBilling: string;
  facilityColor: string;
}