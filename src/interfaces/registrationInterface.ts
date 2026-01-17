

export interface CheckOrgCinLlpinPayload {
  cinNo: string;
  llpinNo: string;
}

export interface GetCityListPayload {
  searchText: string;
}

export interface GetCityListResponse {
  cityName: string;
  stateName: string;
  country: string;
  cityId: number;
  statusMessage: string | null;
  errorMessage: string | null;
  searchText: string | null;
}

export interface GetAreaListSearchTextPayload {
  cityId: string;
  searchWith: string;
  searchText: string;
}

export interface GetAreaListSearchTextResponse {
  areaName: string;
  cityPincodeMappingId: number;
  pincode: string;
  statusMessage: string | null;
  errorMessage: string | null;
}

export interface CheckDuplicateOrgUsernamePayload {
  userName: string;
}

export interface AddNewOrganizationPayload {
  provOrgId: number;
  orgName: string;
  cinNo: string;
  llpinNo: string;
  facilityName: string;
  addr1: string;
  addr2: string;
  searchCity: string;
  searchArea: string;
  pin: string;
  state: string;
  country: string;
  areaValueId: string;
  primaryFacilityTypeId: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  userName: string;
  subscriptionSetupMasterId: string;
}

export interface AddNewOrganizationResponse {
  provOrgId: number;
  datasaved: string;
}

export interface CheckDuplicateOrgPayload {
  orgName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  city: string;
}

export interface CheckDuplicateOrgResponse {
  expire_date: string;
  is_expire: number;
  type: string;
  contactname_found: string;
  contactus_email: string;
  datafound: string;
}
